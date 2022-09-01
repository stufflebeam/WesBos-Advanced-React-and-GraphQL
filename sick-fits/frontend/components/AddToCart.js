import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import LoadingAnimation from './LoadingAnimation';
import { useCart } from '../lib/cartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($productId: ID!) {
    addToCart(productId: $productId) {
      id
      quantity
    }
  }
`;

export default function AddToCart({ id }) {
  const cartState = useCart();
  // console.log('[AddToCart] cartState', cartState);
  // const { cartOpen, cartItems, openCart, closeCart } = cartState;
  const { openCart } = cartState;

  // console.log('[AddToCart] id = ', id);
  const [addToCart, { data, loading, error }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: { productId: id },
      // refetch the currently logged in user to get the updated cart
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  // This is a custom loading animation that I'm using throughout the site.
  // It's a bit more complex than what we built out in the course, but it's
  // also a bit nicer, IMHO. If we'd rather use the 'Add to Cart' -> 'Adding...'
  // approach, then just comment out this conditional, and the rest of the
  // logic is in place already.
  if (loading)
    return (
      <LoadingAnimation
        config={{ height: '12px', width: '12px', color: '#FF0000' }}
      />
    );

  return (
    // <button
    //   type="button"
    //   onClick={(e) => {
    //     console.log('[AddToCart] CLICKED!!! e, id = ', { e, id });
    //     addToCart({ variables: { id } }).catch((err) => console.error(err));
    //   }}
    // >
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        addToCart();
        openCart();
      }}
    >
      Add{loading && 'ing'} to Cart!{' '}
      <FontAwesomeIcon icon={faCartPlus} className="fa-icon" />
    </button>
  );
}
