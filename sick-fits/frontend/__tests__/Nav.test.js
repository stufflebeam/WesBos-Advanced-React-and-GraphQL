import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import { CartStateProvider } from '../lib/cartState';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeItem, fakeUser } from '../lib/testUtils';

// Make some mocks for being signed out, signed in, and signed in with one or more cart items
const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav />', () => {
  it('renders', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    // debug(container);
  });

  it('renders a minimal nav when the user is signed out', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    // debug(container);
    expect(container).toHaveTextContent('Products');
    expect(container).toHaveTextContent('Sign In');
    expect(container).not.toHaveTextContent('Cart');
    expect(container).not.toHaveTextContent('Sell');

    const signinLink = screen.getByText('Sign In');
    expect(signinLink).toBeInTheDocument();
    expect(signinLink).toHaveAttribute('href', '/signin');

    const productsLink = screen.getByText('Products');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('matches the signed out snapshot', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    // debug(container);
    expect(container).toMatchSnapshot();
  });

  it('renders a full nav when the user is signed in', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    // debug(container);
    expect(container).not.toHaveTextContent('Sign In');

    expect(container).toHaveTextContent('Products');
    const productsLink = screen.getByText('Products');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');

    expect(container).toHaveTextContent('Sell');
    const sellLink = screen.getByText('Sell');
    expect(sellLink).toBeInTheDocument();
    expect(sellLink).toHaveAttribute('href', '/sell');

    expect(container).toHaveTextContent('Orders');
    const ordersLink = screen.getByText('Orders');
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', '/orders');

    expect(container).toHaveTextContent('Account');
    const accountLink = screen.getByText('Account');
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute('href', '/account');

    expect(container).toHaveTextContent('Sign Out');

    // Look for the shopping cart icon
    expect(
      container.querySelector('svg.fa-cart-shopping.fa-icon')
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders the number of items in the user's cart", async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    // debug(container);
    // The fakeCartItem that we are using has a quantity of 3, so that's what we need to look for here.
    expect(container).toHaveTextContent('3');
    // or could use the following
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
