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

export default function DeleteProduct({ id, children }) {
  // Delete product mutation and refetch query
  const [deleteProduct, { data, error, loading }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY, variables: { id } }],
    }
  );
  console.log('[DeleteProduct] ', { data, loading, error });

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
