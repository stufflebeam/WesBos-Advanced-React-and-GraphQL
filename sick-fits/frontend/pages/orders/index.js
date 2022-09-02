import { useRouter } from 'next/dist/client/router';
import OrderPagination from '../../components/OrderPagination';
import Orders from '../../components/Orders';

export default function OrdersPage() {
  const { query } = useRouter();
  const currentPage = parseInt(query.page) || 1;
  return (
    <div>
      <OrderPagination page={currentPage} />
      <Orders page={currentPage} />
      <OrderPagination page={currentPage} />
    </div>
  );
}
