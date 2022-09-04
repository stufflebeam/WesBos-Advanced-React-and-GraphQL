import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const AccountCreatedNotificationStyles = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [signUp, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    // This doesn't apply here because signing up doesn't log the user in
    // So, they'll still go through the login process and the CURRENT_USER_QUERY
    // will be run as part of that.
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // console.log({ data, loading, error });

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log('[SignUp] handleSubmit() inputs:', inputs);
    // Send the email and password to the GraphQL API
    const res = await signUp().catch(console.error);
    // console.log('[SignUp] handleSubmit() res:', res);
    // console.log('[SignUp] handleSubmit()', { data, loading, error });
    resetForm();
  }

  // const authError =
  //   data?.authenticateUserWithPassword?.__typename ===
  //   'UserAuthenticationWithPasswordFailure'
  //     ? data?.authenticateUserWithPassword
  //     : undefined;

  if (data?.createUser) {
    return (
      <AccountCreatedNotificationStyles>
        Account created for {data.createUser.email}! <br />
        Please go ahead and Sign In!
      </AccountCreatedNotificationStyles>
    );
  }

  return (
    // Using method="post" to prevent the possibility of a user's password being passed as a query parameter
    // in the browser's address bar.
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up for an Account</h2>
      <DisplayError error={error} />
      {/* {console.log(
        '[SignUp] data?.authenticateUserWithPassword?.message:',
        data?.authenticateUserWithPassword?.message
      )} */}
      {/* <fieldset disabled={loading} aria-busy={loading}> */}
      <fieldset>
        {/* Optionally switch the 'Account Created' message's location to here, if you want
            the sign-up form to remain visible after account creation. */}
        {/* {data?.createUser && (
          <AccountCreatedNotificationStyles>
            Account created for {data.createUser.email}! <br />
            Please go ahead and Sign In!
          </AccountCreatedNotificationStyles>
        )} */}
        <label htmlFor="name">
          Your Name
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            autoComplete="name"
            onChange={handleChange}
            value={inputs.name || ''}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your email address"
            autoComplete="email"
            onChange={handleChange}
            value={inputs.email || ''}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={handleChange}
            value={inputs.password || ''}
          />
        </label>
        <button type="submit">Sign Up</button>
      </fieldset>
    </Form>
  );
}
