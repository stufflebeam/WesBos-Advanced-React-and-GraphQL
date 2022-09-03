import SignIn from './SignIn';
import { useUser } from './User';

export default function PleaseSignIn({ children }) {
  const currentUser = useUser();

  if (!currentUser) return <SignIn />;

  return children;
}
