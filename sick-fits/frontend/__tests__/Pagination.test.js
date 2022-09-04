import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CartStateProvider } from '../lib/cartState';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';
import { perPage } from '../config';

// NOTE: All of the tests here that have numbers in them are based on a config
//       of perPage = 2. If you change the perPage value in config.js, you'll
//       need to update these tests.
//       TODO: Make these tests dynamic based on the perPage value in config.js

describe('<Pagination />', () => {
  it('renders the loader during loading', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(1)}>
          <Pagination page={1} />
        </MockedProvider>
      </CartStateProvider>
    );
    // debug(container);
  });

  it("renders correctly when there's one page", async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(1)}>
          <Pagination page={1} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);
    expect(container).toHaveTextContent('Page 1 of 1');
    expect(container).toHaveTextContent('1 Item Total');

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/0');
    expect(prevLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/2');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('renders correctly when on page one of two', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(4)}>
          <Pagination page={1} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);
    expect(container).toHaveTextContent('Page 1 of 2');
    expect(container).toHaveTextContent('4 Items Total');

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/0');
    expect(prevLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/2');
    expect(nextLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('renders correctly when on page two of two', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(4)}>
          <Pagination page={2} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);
    expect(container).toHaveTextContent('Page 2 of 2');
    expect(container).toHaveTextContent('4 Items Total');

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/1');
    expect(prevLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/3');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('renders correctly for 15 items, when on page 3 of 8', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(15)}>
          <Pagination page={3} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);
    expect(container).toHaveTextContent('Page 3 of 8');
    expect(container).toHaveTextContent('15 Items Total');

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/2');
    expect(prevLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/4');
    expect(nextLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('disables the prev button and enables the next button on the first page', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(6)}>
          <Pagination page={1} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/0');
    expect(prevLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/2');
    expect(nextLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('enables the prev button and disables the next button on the last page', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(6)}>
          <Pagination page={3} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/2');
    expect(prevLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/4');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('enables the prev and next buttons on the middle pages', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(6)}>
          <Pagination page={2} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);

    expect(container).toHaveTextContent('Prev');
    const prevLink = screen.getByText('Prev');
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('href', '/products/1');
    expect(prevLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toHaveTextContent('Next');
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/products/3');
    expect(nextLink).not.toHaveAttribute('aria-disabled', 'true');

    expect(container).toMatchSnapshot();
  });

  it('enables the prev and next buttons on the middle pages [alternate test setup]', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={makePaginationMocksFor(6)}>
          <Pagination page={2} />
        </MockedProvider>
      </CartStateProvider>
    );
    // await screen.findByText('Prev');
    await screen.findByTestId('pagination');
    // debug(container);

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('href', '/products/1');
    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('href', '/products/3');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');

    expect(container).toMatchSnapshot();
  });
});
