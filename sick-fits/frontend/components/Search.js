import { useLazyQuery } from '@apollo/client';
import { useCombobox, resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

// FIXME: There is an issue where if a user searches for an item and then hits the arrow keys + return to navigate
//        to the item's page, once they get there, if they hit the ESC key, the app crashes. I'm not exactly sure
//        why this is happening yet, but it looks like it has something to do with the way Downshift is trying to
//        build out the product's page slug.
//        I made an adjustment that stopped the app from actually crashing, by adding the ? to the pathname construction
//        in the router.push() call. But, there is still an error being thrown in this case.
//        Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
//        So, this needs to be addressed.
//        Similarly, there is an issue where if the user is doing an initial search, and they hit the ESC key, the search
//        bar momentarily closes, but then the search is executed again and the drop-down opens back up. The user can then
//        close it out by hitting ESC again, but this is all less than ideal. I believe that this may have something to do
//        with the alternate useCallback/useMemo based approaches to debouncing that I've tried (and am currently taking),
//        as suggested in the following Slack thread:
//        https://wesbos.slack.com/archives/C9G96G2UB/p1613415611161900
//        When I use the debounce function from lodash only, I don't get any search results back from the server. So, I'll
//        either have to figure out why that is the case (and why my experience is different than Wes' in the video), or
//        I'll need to resolve the issue with the current approach.

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      price
      description
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();

  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );

  console.log('[Search]', { data, loading, error });

  const items = data?.searchTerms || [];

  //   const findItemsButChill
  //   const findItemsDebounced = debounce(findItems, 350);
  // The following is a different debounce solution to account for the original debounce method not working due to re-renders
  // See this Slack thread for more information: https://wesbos.slack.com/archives/C9G96G2UB/p1613415611161900
  //   const findItemsDebounced = useMemo(
  //     () => debounce(findItems, 350),
  //     [findItems]
  //   );

  const findItemsDebounced = useCallback(debounce(findItems, 350), [findItems]);

  resetIdCounter();
  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    inputValue,
    isOpen,
    getItemProps,
  } = useCombobox({
    items,
    onInputValueChange() {
      //   console.log('[Search] input changed - inputValue:', inputValue);
      const res = findItemsDebounced({
        variables: {
          searchTerm: inputValue,
        },
      });
      //   console.log('[Search] res:', res);
    },
    onSelectedItemChange({ selectedItem }) {
      console.log('selectedItem', selectedItem);
      router.push({
        pathname: `/product/${selectedItem?.id}`,
      });
    },
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={index}
              {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item?.photo?.image?.publicUrlTransformed}
                alt={item?.photo?.altText}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, no items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
