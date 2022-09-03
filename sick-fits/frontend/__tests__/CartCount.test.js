import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import CartCount from '../components/CartCount';
import { CartStateProvider } from '../lib/cartState';
import { fakeItem } from '../lib/testUtils';

describe('<CartCount />', () => {
  it('renders', () => {
    render(<CartCount count={10} />);
  });
  it('matches the snapshot', () => {
    const { container } = render(<CartCount count={11} />);
    expect(container).toMatchSnapshot();
  });
  it('updates via props', async () => {
    const { container, rerender, debug } = render(<CartCount count={17} />);
    // These next two are exactly (well, pretty much -- see below*) the same thing
    // the first is just vanilla JS, and the second is more React-flavored
    expect(container.textContent).toBe('17');
    expect(container).toHaveTextContent('17');
    // Update the count via props with a rerender
    rerender(<CartCount count={42} />);
    expect(container.textContent).toBe('4217'); // This will test for both incoming and outgoing counts during the animation
    // Wait for the count to finish updating in the DOM
    // We are using react-transition-group's CSSTransition, so there is a period of time
    // where both the old and new count are rendered in the DOM. So, in order to test
    // effectively, we need to wait for the DOM to fully update.
    // We can do this by using the `wait` function from `waait`
    await wait(400);
    // Can also use the built-in findBy* and waitFot* functions
    // NOTE: getBy* functions are immediate, while findBy* are async and wait for up to ~3 seconds to find the specified element
    // await screen.findByText('42');
    expect(container.textContent).toBe('42'); // *This one will fail without the wait
    expect(container).toHaveTextContent('42'); // *This one will succeed, even when both the old and new count are rendered in the DOM
    // debug(container);
    expect(container).toMatchSnapshot();
  });
});
