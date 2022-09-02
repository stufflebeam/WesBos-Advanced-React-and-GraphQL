import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import LoadingAnimation from './LoadingAnimation';
import Order from './Order';
import { ordersPerPage } from '../config';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($skip: Int = 0, $first: Int) {
    allOrders(first: $first, skip: $skip) {
      id
      total
      charge
      items {
        id
        quantity
        name
        description
        price
        photo {
          id
          image {
            publicUrlTransformed
          }
        }
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

const OrderUL = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function Orders({ page, totalNumberOfOrders }) {
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
  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Sick Fits | Your Orders</title>
      </Head>
      {/* <OrdersListStyles> */}

      {/* TODO: Refactor this to display something along the lines of
                  "Displaying Orders 1-2 of 5"
                  Instead of just the total number shown. */}
      <h2>
        Displaying {allOrders?.length} of {totalNumberOfOrders} Order
        {totalNumberOfOrders === 1 ? '' : 's'}
      </h2>
      <OrderUL>
        {allOrders.map((order) => {
          const totalNumberOfItemsInOrder = countItemsInAnOrder(order);
          return (
            <OrderItemStyles key={order.id} order={order}>
              <Link href={`/order/${order.id}`}>
                <a href="">
                  <h4>Order #{order.id}</h4>
                  <div className="order-meta">
                    <p>
                      {totalNumberOfItemsInOrder} Item
                      {totalNumberOfItemsInOrder === 1 ? '' : 's'}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={`image-${item.id}`}
                        src={item?.photo?.image?.publicUrlTransformed}
                        alt={item?.photo?.altText}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUL>

      {/* </OrdersListStyles> */}
    </div>
  );
}
