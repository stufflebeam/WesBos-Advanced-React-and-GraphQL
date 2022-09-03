import { useRouter } from 'next/dist/client/router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import OrderPagination from '../components/OrderPagination';
import Orders from '../components/Orders';
import PleaseSignIn from '../components/PleaseSignIn';

export const ORDER_PAGINATION_QUERY = gql`
  query ORDER_PAGINATION_QUERY {
    _allOrdersMeta {
      count
    }
  }
`;

export default function OrdersPage() {
  const { error, loading, data } = useQuery(ORDER_PAGINATION_QUERY);
  // console.log('[orders] ', { error, loading, data });
  // const { count: totalNumberOfOrders } = data?._allOrdersMeta;
  const totalNumberOfOrders = data?._allOrdersMeta?.count || 0;
  const { query } = useRouter();
  const currentPage = parseInt(query.page) || 1;
  return (
    <div>
      <PleaseSignIn>
        <OrderPagination
          page={currentPage}
          totalNumberOfOrders={totalNumberOfOrders}
        />
        <Orders page={currentPage} totalNumberOfOrders={totalNumberOfOrders} />
        <OrderPagination
          page={currentPage}
          totalNumberOfOrders={totalNumberOfOrders}
        />
      </PleaseSignIn>
    </div>
  );
}
