import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          email
          name
          # role
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        # As of the October 5, 2021 of Keystone 6,
        # UserAuthenticationWithPasswordFailure no longer has a code value.
        # From what I can tell, this was a decision made from a security standpoint,
        # as it's less than ideal to relay details to the user about _why_ the sign-in failed.
        # Doing so provides extra information to malicious actors that makes it easier for them
        # to optimize their approach and gain access to a user's account.
        # As of 8-29-2022, the code value is still being returned, but it consistently as the value
        # of FAILURE. Further, as per these release notes: https://keystonejs.com/releases/2021-10-05
        # It sounds like it could be removed at any time. As such, I'm going to remove it from the
        # request, so as to keep the request as clean as possible and avoid any potential issues
        # going forward.

        # For reference, these are the consistently returned values when a user's sign-in attemt fails:
        #
        # data {
        #   authenticateUserWithPassword {
        #     code: "FAILURE"
        #     message: "Authentication failed."
        #     __typename: "UserAuthenticationWithPasswordFailure"
        #   }
        # }

        # code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    password: '',
  });

  const [signIn, { data, loading, error }] = useMutation(SIGN_IN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // console.log({ data, loading, error });

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log('[SignIn] handleSubmit() inputs:', inputs);
    // Send the email and password to the GraphQL API
    const res = await signIn();
    console.log('[SignIn] handleSubmit() res:', res);
    resetForm();
  }

  const authError =
    data?.authenticateUserWithPassword?.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    // Using method="post" to prevent the possibility of a user's password being passed as a query parameter
    // in the browser's address bar.
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <DisplayError error={authError} />
      {/* {console.log(
        '[SignIn] data?.authenticateUserWithPassword?.message:',
        data?.authenticateUserWithPassword?.message
      )} */}
      {/* <fieldset disabled={loading} aria-busy={loading}> */}
      <fieldset>
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
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}
