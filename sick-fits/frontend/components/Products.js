import gql from 'graphql-tag';
// auto-import returned a much deeper link (see below), but the above
// import is the right one, I believe. So, that's what I'm going with.
// import gql from "../node_modules/graphql-tag/lib/index";
// auto-import is having trouble importing useQuery as well now...
// unsure what's going on here. :(
import { useQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import LoadingAnimation from './LoadingAnimation';
import Product from './Product';

export const ALL_PRODUCTS_QUERY = gql`
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

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  /* max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto; */
`;

export default function Products() {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);
  //   console.log('[Products]: data:', data);
  //   console.log('[Products]: error:', error);
  //   console.log('[Products]: loading:', loading);

  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <ProductsListStyles>
        {data.allProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductsListStyles>
    </div>
  );
}
