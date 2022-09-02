import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
// import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Title from './styles/Title';

const OrderItemStyles = styled.div`
  display: grid;
  grid-template-columns: 15vw 5vw 15vw 10vw;
  grid-gap: 2rem;
  border-bottom: 1px solid var(--lightGrey);
  padding-bottom: 2rem;
  align-items: center;
  .order-information-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
const OrderTotal = styled.div``;

export default function Order({ order }) {
  // console.log('[Order] order: ', order);
  const totalNumberOfItems = order.items.reduce(
    (tally, item) => tally + item.quantity,
    0
  );
  return (
    <OrderItemStyles key={order.id}>
      <Link href={`/order/${order.id}`}>
        <a className="order-information-link">
          <FontAwesomeIcon icon={faCircleInfo} className="fa-icon" />
          {order.id}
        </a>
      </Link>
      {/* TODO: Add Order date/timestamp to the data, to this Order List page, and to the individual order page. */}
      <p>
        {totalNumberOfItems} Item{totalNumberOfItems > 1 ? 's' : ''}
      </p>
      <p>{order.charge}</p>
      <OrderTotal>{formatMoney(order.total)}</OrderTotal>
    </OrderItemStyles>
  );
}

// export default Product;
