import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Product from '../components/Product';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { CartStateProvider } from '../lib/cartState';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

const mocks = [
  {
    // When someone requests this query and variable combo
    request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
    // Return this data (result)
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct/>', () => {
  it('renders with proper data', async () => {
    // Create fake data
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={mocks}>
          <SingleProduct id="123" />
        </MockedProvider>
      </CartStateProvider>
    );
    // Wait for the test Id to show up
    await screen.findByTestId('singleProduct');
    // debug();
    expect(container).toMatchSnapshot();
  });

  it('errors out when an item is not found', async () => {
    const errorMock = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        result: {
          errors: [{ message: 'Item not found' }],
        },
      },
    ];
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={errorMock}>
          <SingleProduct id="123" />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByTestId('graphql-error');
    // debug();
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found');
  });
});
