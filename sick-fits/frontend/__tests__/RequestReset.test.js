import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { CartStateProvider } from '../lib/cartState';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';
// import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = '12345678';

const mocks = [
  // Mutation Mock
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: {
        email: me.email,
      },
    },
    result: {
      data: {
        sendUserPasswordResetLink: null,
      },
    },
  },
  // Current User Query Mock
  //   {
  //     request: { query: CURRENT_USER_QUERY },
  //     result: { data: { authenticatedItem: me } },
  //   },
];

describe('<RequestReset />', () => {
  it('renders and matches the snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    // debug(container);
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // debug(container);
    // expect(container).toMatchSnapshot();
    // Type into the boxes in the form
    // NOTE: Can also use a regex to match the email input
    // e.g. screen.getByPlaceholderText(/email/i)
    userEvent.type(screen.getByPlaceholderText('Your email address'), me.email);
    // Click the Submit button
    userEvent.click(screen.getByText('Reset Password'));
    // Check for the success message
    await screen.findByText(
      'Success! Check your email for a reset link. If an account was located for the provided email address, a password reset link has been sent.'
    );
    // debug();
    expect(container).toMatchSnapshot();
  });
});
