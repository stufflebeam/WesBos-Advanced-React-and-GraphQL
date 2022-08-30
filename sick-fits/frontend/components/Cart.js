import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import { useUser } from './User';

export default function Cart() {
  const currentUser = useUser();
  console.log('[Cart] currentUser', currentUser);
  if (!currentUser) {
    return null;
  }
  return (
    <CartStyles open>
      <header>
        <Supreme>
          {currentUser?.name}'s Cart{' '}
          <FontAwesomeIcon icon={faShoppingCart} className="fa-icon" />
        </Supreme>
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
