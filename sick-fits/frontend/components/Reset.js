import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';

const ResetSuccessNotificationStyles = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  // console.log('[Reset] token:', token);
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    token,
    password: '',
    // confirmPassword: '', // TODO: Add this field to the form and build in validation
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  // TODO: Currently, a password reset token is used up if the user attempts to use it but
  //       fails a validation check like the one that checks if the password is too short.
  //       This doesn't really make sense. Wes noted in video #41 at around 13.30 that he
  //       thinks this is a bug in the KeystoneJS implementation and that he would log an
  //       issue with the Keystone team. It looks like the issue still exists in Keystone 6
  //       though, as of 8/30/2022 at least. So, look into this and reach out to the
  //       Keystone team if there's not already an open issue about it.
  //       In the interim, we could also just build out password validation on the frontend
  //       and make sure that all of Keystone's password validation checks pass before we
  //       even send the request to the backend.
  const resetError = data?.redeemUserPasswordResetToken?.code
    ? data.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('[Reset] handleSubmit() inputs:', inputs);
    // Send the email, reset token, and new password to the GraphQL API
    const res = await reset().catch(console.error);
    console.log('[Reset] handleSubmit() res:', res);
    console.log('[Reset] handleSubmit()', { data, loading, error });
    resetForm();
  }

  // TODO: Fix this so that the user gets feedback re: whether the password reset was successful or not
  //
  // Failure response:
  // data:
  //   redeemUserPasswordResetToken:
  //     code: "FAILURE"
  //     message: "Auth token redemption failed."
  //     __typename: "RedeemUserPasswordResetTokenResult"
  //
  if (data?.redeemUserPasswordResetToken === null) {
    return (
      <>
        <ResetSuccessNotificationStyles>
          Success! Please sign into your account.
        </ResetSuccessNotificationStyles>
        <SignIn />
      </>
    );
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <DisplayError error={error || resetError} />
      {/* <fieldset disabled={loading} aria-busy={loading}> */}
      <fieldset>
        {/* Optionally switch the 'Reset Successful' message's location to here, if you want
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
        <label htmlFor="password">
          New Password
          <input
            type="password"
            name="password"
            id="password"
            placeholder="New Password"
            autoComplete="new-password"
            onChange={handleChange}
            value={inputs.password || ''}
          />
        </label>
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  );
}
