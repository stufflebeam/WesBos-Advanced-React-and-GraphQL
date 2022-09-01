import Link from 'next/link';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser, CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';

export default function Nav() {
  const user = useUser();
  // console.log('[Nav] user:', user);

  const cartState = useCart();
  // console.log('[Nav] cartState', cartState);
  const { cartOpen, cartItems, openCart, closeCart } = cartState;

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
          {/* <Link href="/signout">Sign Out</Link> */}
          <SignOut />
          <button type="button" onClick={openCart}>
            <FontAwesomeIcon icon={faShoppingCart} className="fa-icon" />
            <CartCount
              count={user.cart.reduce(
                (tally, cartItem) => tally + cartItem.quantity,
                0
              )}
            />
          </button>
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </NavStyles>
  );
}
