import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { CartStateProvider } from '../lib/cartState';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
// import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = '12345678';

const mocks = [
  // Mutation Mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          name: me.name,
          email: me.email,
        },
      },
    },
  },
  // Current User Query Mock
  //   {
  //     request: { query: CURRENT_USER_QUERY },
  //     result: { data: { authenticatedItem: me } },
  //   },
];

describe('<SignUp />', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    // debug(container);
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation and notifies the user of successful account creation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );

    // Type into the boxes in the form
    await userEvent.type(screen.getByPlaceholderText('Your Name'), me.name);
    await userEvent.type(
      screen.getByPlaceholderText('Your email address'),
      me.email
    );
    // TODO: Add tests for insufficiently-complex passwords
    await userEvent.type(screen.getByPlaceholderText('Password'), password);
    // Click the Submit button
    await userEvent.click(screen.getByText('Sign Up'));

    // Wait for the mutation to resolve
    await screen.findByText(
      `Account created for ${me.email}! Please go ahead and Sign In!`
    );

    // debug(container);

    expect(container).toMatchSnapshot();
  });
});
