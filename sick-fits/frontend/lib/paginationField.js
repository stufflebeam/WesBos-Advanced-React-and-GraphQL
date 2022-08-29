// import {PAGINATION_QUERY} from '../graphql/queries'; // TODO: move all queries to graphql folder
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // This tells Apollo that we will take care of everything.
    read(existing = [], { args, cache }) {
      //   console.log({ existing, args, cache });
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      //   console.log({ first, skip, data });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1; // Math.ceil(skip / first) + 1;
      const pageCount = Math.ceil(count / first);
      console.log('[paginationField] read():', {
        skip,
        first,
        count,
        page,
        pageCount,
      });

      // Check to see if we have the requested items in the cache.
      const items = existing.slice(skip, skip + first).filter((x) => x); // TODO: Should this be .filter((x) => !!x);

      /* 
      IF
        There are items
        AND the number of items is not enough to satisfy the request (i.e. there are not enough to fill the page)
        AND we are on the last page
      THEN just send the data back to Apollo
      */

      // TODO: Handle the case where a user tries to navigate to a page that doesn't exist.
      //       For example, if there are 10 items total, and we're showing 4 items per page,
      //       and the user navigates to page 5, we should either route them to the main
      //       products page OR route them to the last products page by updating the URL
      //       from products/5 to products/3 and showing them the last 2 items.

      if (items.length && items.length !== first && page === pageCount) {
        return items;
      }

      if (items.length !== first) {
        // If we don't have all the items, we need to fetch them.
        return false;
      }

      // If we have all the items, we can just return them.
      if (items.length) {
        console.log(
          `[paginationField]: There are ${items.length} items in the cache. Sending them to Apollo...`
        );
        return items;
      }

      // If either of the previous return statements didn't return anything, we need to fetch the items,
      // so we return false.
      return false;

      // When we run a query, the first thing that Apollo does is ask the read() function for those items.
      // When this happens, we can do one of two things:
      // 1. If we have the data, we can return it.
      // 2. If we don't have the data, we can return null or false, which will tell Apollo to run the query via the network.
    },
    merge(existing, incoming, { args, cache }) {
      // When Apollo gets query results back from the network for items that the read() function returned false for,
      // it will call the merge() function to merge the results into the cache.
      // So, this is where we decide how we want to put the returned data into the cache.
      const { skip, first } = args;

      console.log('[paginationField]: merging items from the network...]', {
        existing,
        incoming,
        args,
        cache,
      });
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log('[paginationField] merge():', { merged });

      // return the merged items
      // at this point, Apollo will call the read() function again to see if it can return the
      // merged items from the cache.
      return merged;
    },
  };
}
