import gql from 'graphql-tag';
// auto-import returned a much deeper link (see below), but the above
// import is the right one, I believe. So, that's what I'm going with.
// import gql from "../node_modules/graphql-tag/lib/index";
// auto-import is having trouble importing useQuery as well now...
// unsure what's going on here. :(
import { useQuery } from '@apollo/client';
import ReactLoading from 'react-loading';

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

  // Loading animation config -- TODO: standardize this across all components
  const loadingConfig = {
    type: 'bubbles',
    color: '#000',
    delay: 0,
    height: 64,
    width: 64,
    className: 'loading-animation',
  };
  if (loading)
    return (
      <ReactLoading
        type={loadingConfig.type}
        color={loadingConfig.color}
        height={loadingConfig.height}
        width={loadingConfig.width}
        className={loadingConfig.className}
      />
    );
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1>Products component</h1>
    </div>
  );
}
