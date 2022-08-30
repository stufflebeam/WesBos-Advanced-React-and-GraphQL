import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
// import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    endSession
  }
`;

export default function SignOut() {
  const [signOut, { data, loading, error }] = useMutation(SIGN_OUT_MUTATION, {
    // refetch the currently logged in user to make sure that the user is no longer signed in
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // console.log({ data, loading, error });

  // async function handleClick(e) {
  //   // console.log('[SignOut] handleClick()');
  //   const res = await signOut();
  //   // console.log('[SignOut] handleClick() res:', res);
  // }

  return (
    <button type="button" onClick={signOut}>
      Sign Out
    </button>
  );
}
