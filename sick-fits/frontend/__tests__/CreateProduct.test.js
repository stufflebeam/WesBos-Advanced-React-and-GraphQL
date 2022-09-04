import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router'; // We will mock this
import wait from 'waait';
import { waitFor } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { ALL_PRODUCTS_QUERY } from '../components/Products';
import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';

const item = fakeItem();

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

const mocks = [
  // Create Product Mutation Mock
  {
    request: {
      query: CREATE_PRODUCT_MUTATION,
      variables: {
        name: item.name,
        description: item.description,
        price: item.price,
        image: '',
      },
    },
    result: {
      data: {
        createProduct: {
          __typename: 'Item',
          ...item, // Spread in all the fake item fields
          //   id: 'abc123',
          //   name: item.name,
          //   description: item.description,
          //   price: item.price,
          //   image: {},
        },
      },
    },
  },
  // All Products Query Mock
  {
    request: { query: ALL_PRODUCTS_QUERY, variables: { skip: 0, first: 2 } },
    result: {
      data: {
        allProducts: [item],
      },
    },
  },
];

describe('<CreateProduct />', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    // debug(container);
    expect(container).toMatchSnapshot();
  });

  it('handles the updating of form elements', async () => {
    // 1. Render the form
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    // 2. Type into the form fields
    // await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);
    await userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    // await userEvent.type( screen.getByPlaceholderText(/description/i), item.description );
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );
    // await userEvent.type(
    //   screen.getByPlaceholderText(/price/i),
    //   item.price.toString()
    // );
    // await userEvent.type(
    //   screen.getByTestId('create-product-price'),
    //   item.price.toString()
    // );
    const priceInput = screen.getByTestId('create-product-price');
    expect(priceInput).toBeInTheDocument();
    // NOTE: We must clear() the value of the input box before typing in the new value
    //       as otherwise the value will be appended to the existing value, so typing
    //       in '5000' would result in a display value of '05000' instead of '5000'
    //       See this Slack post for more details:
    //       https://wesbos.slack.com/archives/C9G96G2UB/p1642598592183300?thread_ts=1642560686.178400&cid=C9G96G2UB
    userEvent.clear(priceInput);
    await userEvent.type(priceInput, item.price.toString());

    // 3. Check that the inputs have the expected values
    // debug(container);
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("creates a new product and navigates to the new product's page when the form is submitted", async () => {
    // NOTE: Could also create the mocks here inside this test, if they are only needed here.
    //       However, I prefer to keep the mocks outside of the test, so that they are
    //       accessible to other tests if I end up wanting to use them elsewhere.
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );
    // debug(container);
    //   expect(container).toMatchSnapshot();
    // 1. Type into the form fields
    await userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );
    const priceInput = screen.getByTestId('create-product-price');
    expect(priceInput).toBeInTheDocument();
    // NOTE: We must clear() the value of the input box before typing in the new value (SEE ABOVE FOR MORE INFORMATION)
    userEvent.clear(priceInput);
    await userEvent.type(priceInput, item.price.toString());
    const addProductButton = screen.getByRole('button', {
      name: /Add Product/i,
    });
    // debug(addProductButton);

    // FIXME: Added this explicit call to act() to try an get around the warnings in the console,
    //        but it's still triggering them.
    //        The underlying issue is that the form is cleared during the try block of the product
    //        creation process. Inside useForm, there is a function called clearForm, which is
    //        which is called by CreateProduct. This, I believe, is causing the warnings by updating
    //        the DOM with the cleared form after our tests are done. However, I've tested for these
    //        In several spots here, with a number of timeout settings, and the warnings persist.
    //        Even with the clearForm call commented out, I'm still getting the warnings though. So,
    //        I'm not sure exactly what's going on here. Need to revist this to fix.
    await act(async () => await userEvent.click(addProductButton));
    // await userEvent.click(addProductButton);

    await waitFor(() => wait(0));
    // Check that the form inputs have been reset
    expect(screen.getByPlaceholderText('Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Description')).toHaveValue('');
    expect(priceInput).toHaveValue(null);

    await waitFor(() => wait(40));

    // Wait to see if the page change is initiated (and happens successfully)
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: `/product/${item.id}`,
    });

    // const productComponent = await screen.findByTestId('product-component');
    // debug();
  });
});
