// import { render } from "../node_modules/@testing-library/react/types/index";
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Product from '../components/Product';
import { fakeItem } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';

const product = fakeItem();

describe('<Product/>', () => {
  it('renders out the price tag and title', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Product product={product} />
        </MockedProvider>
      </CartStateProvider>
    );
    // debug();
    const priceTag = screen.getByText('$50');
    // debug(priceTag);
    expect(priceTag).toBeInTheDocument();
    const link = container.querySelector('a');
    debug(link);
    // These values can be explicitly set here or be pulled in dynamically from the mock data
    expect(link).toHaveAttribute('href', '/product/abc123');
    expect(link).toHaveAttribute('href', `/product/${product.id}`);
    expect(link).toHaveTextContent(product.name);
  });
});
