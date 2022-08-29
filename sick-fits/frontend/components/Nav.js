import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser, CURRENT_USER_QUERY } from './User';

export default function Nav() {
  const user = useUser();
  console.log('[Nav] user:', user);

  return (
    <NavStyles>
      {/* <Link href="/">Home</Link> */}
      <Link href="/products">Products</Link>
      {user ? (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          {/* <Link href="/cart">Cart</Link> */}
          <Link href="/logout">Logout</Link>
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </NavStyles>
  );
}
