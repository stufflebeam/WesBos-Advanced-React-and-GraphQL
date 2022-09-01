import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';
import LoadingAnimation from './LoadingAnimation';
// import { useCart } from '../lib/cartState';

const BigButton = styled.button`
  font-size: 2rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_FROM_CART_MUTATION = gql`
  mutation DELETE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
      # quantity
      # product {
      #   id
      #   name
      #   price
      #   description
      # }
      # user {
      #   id
      #   name
      #   email
      # }
    }
  }
`;
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function DeleteFromCart({ id }) {
  // const cartState = useCart();
  // console.log('[DeleteFromCart] cartState', cartState);
  // const { cartOpen, cartItems, openCart, closeCart } = cartState;
  // const { openCart } = cartState;

  // console.log('DeleteFromCart] id = ', id);
  const [deleteFromCart, { data, loading, error }] = useMutation(
    DELETE_FROM_CART_MUTATION,
    {
      variables: { id },
      // refetch the currently logged in user to get the updated cart
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
      // Instead of going back to the network to refetch the user query, just evict the item from the cache
      update,
      // Having to comment this out for now, because it's currently causing an error
      // This appears to be a bug in Keystone. So, just waiting for a fix before re-enabling this optimistic response.
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   deleteCartItem: {
      //     __typename: 'CartItem',
      //     id,
      //   },
      // },
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
    <BigButton
      type="button"
      disabled={loading}
      onClick={deleteFromCart}
      title="Remove this item from the cart"
    >
      <FontAwesomeIcon icon={faTrash} className="fa-icon" />
    </BigButton>
  );
}
