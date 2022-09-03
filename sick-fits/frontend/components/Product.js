import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import formatMoney from '../lib/formatMoney';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Title from './styles/Title';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';

// This is one example of a placeholder image that can be used when a product
// doesn't have a photo.
// TODO: Ideally, we would use different placeholder images for different products.
// For example, we could use a shoe placeholder image for shoes, a hat placeholder
// image for hats, and so on.
// This would probably be easiest if we added a 'category' field to each of the products.
// If a product can be in multiple categories, we could designate one as the 'primary'
// or just use the first one. Not that important at the moment, but it's something to
// keep in mind, as having category-tailored placeholder images would add to the
// fit and finish of the site.
// For now though, we'll just use the same placeholder image for all products.
const placeholder =
  'https://res.cloudinary.com/stufflebeam/image/upload/v1661582104/placeholder/placeholder-images-product-2_large.webp';

// TODO: Once the product grid is fully styled, if there is still an issue with long
//       descriptions looking terrible, then we should truncate them at word boundaries
//       and add an ellipsis.
//       We can wire that up ourselves, but it'd be quickest and easiest to just use
//       something like this:
//       https://www.npmjs.com/package/ellipsize
//       If we end up supporting HTML in descriptions, then we'll need to use something
//       like this instead:
//       https://www.npmjs.com/package/react-truncate-html
//       It might also be better to just return the first line of the description
//       or add a 'short description' field or a 'subhead' field to the products table.

// TODO: Conditionally render the Buy and Edit buttons, depending on whether or not
//       the user is signed in and whether or not they have the correct permissions.

// TODO: Conditionally render the products in the grid, depending on whether or not
//       the products are available or not.

// const Product = ({ product }) => (
export default function Product({ product }) {
  return (
    <ItemStyles key={product.id}>
      <img
        src={product?.photo?.image?.publicUrlTransformed || placeholder}
        alt={product?.photo?.altText || product?.name}
      />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        {/* <Link href={`/product/${product.id}`}>
          <a>View Product</a>
        </Link> */}
        <Link
          href={{
            pathname: '/update',
            query: { id: product.id },
          }}
        >
          {/* Have to wrap in an anchor tag because Link expects a single chile */}
          <button type="button">
            {/* TODO: Add custom styling to these Font Awesome icons to give them a bit of margin */}
            Edit <FontAwesomeIcon icon={faPencil} className="fa-icon" />
          </button>
        </Link>
        <DeleteProduct id={product.id}>
          Delete <FontAwesomeIcon icon={faTrash} className="fa-icon" />
        </DeleteProduct>
        <AddToCart id={product.id} />
      </div>
    </ItemStyles>
  );
}

// export default Product;
