import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage() {
  const { query } = useRouter();
  const currentPage = parseInt(query.page) || 1;
  return (
    <div>
      <Pagination page={currentPage} />
      <Products page={currentPage} />
      <Pagination page={currentPage} />
    </div>
  );
}
