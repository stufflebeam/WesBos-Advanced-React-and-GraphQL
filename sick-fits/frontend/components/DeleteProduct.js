// Going to wire this up to actually delete the product for now, but ideally we would
// do a soft delete by updating the product's status to 'deleted' instead. That way,
// the product will still be visible in the admin dashboard, and the user can restore
// or 'undelete' the product if they so choose.
// We could even implement a 30-day grace period for restoring deleted products or
// something of that nature. Or just have a 'trash' feature that allows the user to
// delete products permanently if they know that they don't ever want to restore them.

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { ALL_PRODUCTS_QUERY } from './Products';
import LoadingAnimation from './LoadingAnimation';
// import DisplayError from './ErrorMessage';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
      price
      description
    }
  }
`;

function update(cache, payload) {
  // The following is the code suggested by Github Copilot when I opened up this function.
  // It is very different from what we are writing here, but I'm interested to see if it works,
  // and to understand how it works if it does. So, I'm leaving it here for now.
  // const data = cache.readQuery({ query: ALL_PRODUCTS_QUERY });
  // data.products = data.products.filter(product => product.id !== payload.data.deleteProduct.id);
  // cache.writeQuery({ query: ALL_PRODUCTS_QUERY, data });
  // --------------------------------------------------------------------------------------------
  // The following is the code we are writing.
  cache.evict(cache.identify(payload.data.deleteProduct));
  // console.log(
  //   '[DeleteProduct] product evicted from cache',
  //   payload.data.deleteProduct
  // );
}

export default function DeleteProduct({ id, children }) {
  // Delete product mutation and refetch query
  const [deleteProduct, { data, error, loading }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      //   switching to evict the deleted item from cache once the mutation is complete
      //   instead of going back to the network to get the updated list of products
      //   refetchQueries: [{ query: ALL_PRODUCTS_QUERY, variables: { id } }],
      update,
    }
  );
  // console.log('[DeleteProduct] ', { data, loading, error });

  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  //   if (error) return <p>Error: {error.message}</p>;
  //   if (error) return <DisplayError error={error} />;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        // TODO: Configure no-restricted-globals to allow use of confirm()
        confirm('Are you sure you want to delete this product?') &&
          deleteProduct({ variables: { id } }).catch((err) =>
            alert(err.message)
          );
        // TODO: Swap this alert for a toast message
      }}
    >
      {children}
    </button>
  );
}
