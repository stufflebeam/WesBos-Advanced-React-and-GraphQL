import { faShoppingCart, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import { useUser } from './User';
import { useCart } from '../lib/cartState';

const CloseCartStyles = styled.span`
  font-size: 4rem;
  right: 3rem;
  position: absolute;
  :hover {
    color: red;
    cursor: pointer;
  }
`;

export default function Cart() {
  const currentUser = useUser();
  console.log('[Cart] currentUser', currentUser);
  if (!currentUser) {
    return null;
  }

  const cartState = useCart();
  console.log('[Cart] cartState', cartState);
  const { cartOpen, cartItems, closeCart } = cartState;

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>
          {currentUser?.name}'s Cart{' '}
          <FontAwesomeIcon icon={faShoppingCart} className="fa-icon" />
        </Supreme>
        <CloseCartStyles type="button" onClick={closeCart}>
          <FontAwesomeIcon icon={faXmark} className="fa-icon" />
        </CloseCartStyles>
      </header>
      <ul>
        {currentUser?.cart.map((cartItem) => (
          <CartItem key={cartItem.id} id={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
      </footer>
    </CartStyles>
  );
}
