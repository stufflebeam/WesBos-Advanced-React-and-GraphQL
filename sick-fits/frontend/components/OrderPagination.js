import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from '@fortawesome/free-solid-svg-icons';
import OrderPaginationStyles from './styles/OrderPaginationStyles';
import LoadingAnimation from './LoadingAnimation';
import DisplayError from './ErrorMessage';
import { ordersPerPage } from '../config';

// TODO: Refactor this and the Project Pagination component so that we use the same component for
//       both (and for any other pagination that we may need in the app in the future). This will
//       require us to pass in the query and any variables as props to the component.

// TODO: Refactor this so that the component simply uses the totalNumberOfOrders prop instead of
//       making a separate query to get the total number of orders. I am already passing in that
//       value as a prop from the orders page. So, it's just a matter of refactoring the component
//       to use that value instead of making a separate query.

export const ORDER_PAGINATION_QUERY = gql`
  query ORDER_PAGINATION_QUERY {
    _allOrdersMeta {
      count
    }
  }
`;

export default function OrderPagination({ page }) {
  const { error, loading, data } = useQuery(ORDER_PAGINATION_QUERY);
  if (loading) return <LoadingAnimation config={{ color: '#FF0000' }} />;
  if (error) return <DisplayError error={error} />;
  // console.log('[OrderPagination]: data:', data);
  const { count } = data._allOrdersMeta;
  const pageCount = Math.ceil(count / ordersPerPage);
  // console.log('[OrderPagination]: count, pageCount, ordersPerPage:', {
  //   count,
  //   pageCount,
  //   ordersPerPage,
  // });

  return (
    <OrderPaginationStyles>
      <Head>
        <title>
          Sick Fits - Orders - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/orders/${page - 1}`}>
        <a aria-disabled={page <= 1}>
          <FontAwesomeIcon icon={faLongArrowAltLeft} className="fa-icon" />
          Prev
        </a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/orders/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>
          Next
          <FontAwesomeIcon icon={faLongArrowAltRight} className="fa-icon" />
        </a>
      </Link>
    </OrderPaginationStyles>
  );
}
