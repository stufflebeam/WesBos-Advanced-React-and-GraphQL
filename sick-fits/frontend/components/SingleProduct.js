import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';
import LoadingAnimation from './LoadingAnimation';
import formatMoney from '../lib/formatMoney';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: (--maxWidth);
  justify-content: center;
  align-items: start;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY(
    # which variables we want to pass to the query
    $id: ID!
  ) {
    Product(where: { id: $id }) {
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

export default function SingleProduct({ id }) {
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  //   console.log({ data, loading, error });
  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  //   if (error) return <p>Error: {error.message}</p>;
  if (error) return <DisplayError error={error} />;
  const { name, price, description, photo } = data.Product;
  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {name}</title>
      </Head>
      {/* <DisplayError error={error} /> */}
      {/* 
      // TODO: Centralize the placeholder image logic in a reusable component.
      //       so that it can be used here as well.
      //       The placholder image is currently set up explicitly in Product.js
      //       there are notes there about what we would ideally do with those.
      //       In this case, however, where we are going to be able to edit the
      //       product details (and replace the image), we should either use a
      //       different placeholder that makes it clear that it should be replaced
      //       or we should display an overlay over top of the reguar placeholder
      //       that indicates that it should be replaced.
      */}
      <img
        src={photo?.image?.publicUrlTransformed}
        alt={photo?.altText || photo?.name}
        className=""
      />
      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <p>
        <strong>{formatMoney(price)}</strong>
      </p>
    </ProductStyles>
  );
}
