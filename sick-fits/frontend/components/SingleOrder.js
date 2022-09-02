import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';
import LoadingAnimation from './LoadingAnimation';
import formatMoney from '../lib/formatMoney';
import OrderStyles from './styles/OrderStyles';

// const OrderStyles = styled.div`
//   /* display: grid;
//   grid-auto-columns: 1fr;
//   grid-auto-flow: column;
//   max-width: (--maxWidth);
//   justify-content: center;
//   align-items: start;
//   gap: 2rem;
//   img {
//     width: 100%;
//     object-fit: contain;
//   } */
//   .order-item {
//     display: grid;
//     grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
//     grid-gap: 1rem;
//     margin-bottom: 1rem;
//     border-bottom: 1px solid var(--lightGrey);
//     padding-bottom: 1rem;
//     img {
//       width: 300px;
//       /* object-fit: contain; */
//     }
//   }
// `;

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY(
    # which variables we want to pass to the query
    $id: ID!
  ) {
    Order(where: { id: $id }) {
      id
      user {
        id
        name
        email
      }
      total
      charge
      items {
        id
        price
        quantity
        description
        name
        photo {
          id
          altText
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { loading, error, data } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });
  //   console.log('[SingleOrder] SINGLE_ORDER_QUERY: '{ data, loading, error });
  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  //   if (error) return <p>Error: {error.message}</p>;
  if (error) return <DisplayError error={error} />;
  const { id: orderId, user, total, charge, items } = data.Order;
  const totalNumberOfItems = items.reduce(
    (tally, item) => tally + item.quantity,
    0
  );
  return (
    <OrderStyles>
      <Head>
        {/* TODO: Come up with a better, user-facing Order Id to use */}
        <title>Sick Fits | Order {orderId}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{orderId}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{totalNumberOfItems}</span>
      </p>
      <div className="items">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.photo.altText}
            />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <DisplayError error={error} /> */}
      {/* <h1>Order #{orderId}</h1>
      <hr />
      <p>Order Details</p>
      <p>Order Total: {formatMoney(total)}</p>
      <p>Charge: {charge}</p>
      <hr />
      <p>Items</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="order-item">
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.photo.altText}
            />
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {formatMoney(item.price)}</p>
            <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
            <p>Description: {item.description}</p>
          </li>
        ))}
      </ul> */}
    </OrderStyles>
  );
}
