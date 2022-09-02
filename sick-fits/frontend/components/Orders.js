import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import LoadingAnimation from './LoadingAnimation';
import Order from './Order';
import { ordersPerPage } from '../config';

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($skip: Int = 0, $first: Int) {
    allOrders(first: $first, skip: $skip) {
      id
      total
      charge
      items {
        id
        quantity
      }
    }
  }
`;

const OrdersListStyles = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 60px;
  /* max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto; */
`;

export default function Orders({ page }) {
  const { data, error, loading } = useQuery(ALL_ORDERS_QUERY, {
    variables: {
      skip: page * ordersPerPage - ordersPerPage,
      first: ordersPerPage,
    },
  });
  //   console.log('[Orders]: data:', data);
  //   console.log('[Orders]: error:', error);
  //   console.log('[Orders]: loading:', loading);

  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <OrdersListStyles>
        {data.allOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </OrdersListStyles>
    </div>
  );
}
