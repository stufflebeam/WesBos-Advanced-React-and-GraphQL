import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const ResetRequestedNotificationStyles = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
  });

  const [requestReset, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  // As of the October 5, 2021 release of KeystoneJS, the sendUserPasswordResetLink
  // mutation no longer returns a code or message.
  // From what I can tell, this change was made for a similar reason as the reason
  // the team decided to remove the code from the UserAuthenticationWithPasswordFailure
  // mutation's response. Limiting the return values in these cases reduces the amount
  // of information that a malicious actor can gain from the response.
  // See the following release notes for more details: https://keystonejs.com/releases/2021-10-05
  // console.log('[RequestReset]', { data, loading, error });

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log('[RequestReset] handleSubmit() inputs:', inputs);
    // Send the email to the GraphQL API
    const res = await requestReset().catch(console.error);
    // console.log('[RequestReset] handleSubmit() res:', res);
    // console.log('[RequestReset] handleSubmit()', { data, loading, error });
    resetForm();
  }

  if (data?.sendUserPasswordResetLink === null) {
    return (
      <ResetRequestedNotificationStyles>
        Success! <br /> <br />
        Check your email for a reset link.
        <br /> <br />
        If an account was located for the provided email address, a password
        reset link has been sent.
      </ResetRequestedNotificationStyles>
    );
  }

  // TODO: Clean up this UI so that only the sign-in form and sign-up form are shown on page load.
  //       Add a "Forgot Password" link to the sign-in form, which, when clicked, will display the
  //       password reset request form.
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <DisplayError error={error} />
      {/* <fieldset disabled={loading} aria-busy={loading}> */}
      <fieldset>
        {/* Optionally switch the 'Reset Request Submitted' message's location to here, if you want
            the reset request form to remain visible after submission. */}
        {/* {data?.createUser && (
          <ResetRequestedNotificationStyles>
            Account created for {data.createUser.email}! <br />
            Please go ahead and Sign In!
          </ResetRequestedNotificationStyles>
        )} */}
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
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  );
}
