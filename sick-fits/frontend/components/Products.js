import gql from 'graphql-tag';
// auto-import returned a much deeper link (see below), but the above
// import is the right one, I believe. So, that's what I'm going with.
// import gql from "../node_modules/graphql-tag/lib/index";
// auto-import is having trouble importing useQuery as well now...
// unsure what's going on here. :(
import { useQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import LoadingAnimation from './LoadingAnimation';

const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      price
      description
      photo {
        id
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Products() {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);
  console.log('[Products]: data:', data);
  console.log('[Products]: error:', error);
  console.log('[Products]: loading:', loading);

  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1>Products component</h1>
    </div>
  );
}
