import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';

export const CartItem = list({
  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO: add custom lable for cart item
    quantity: integer({
      // label: 'Quantity',
      isRequired: true,
      defaultValue: 1,
    }),
    product: relationship({
      ref: 'Product',
      // isRequired: true,
    }),
    user: relationship({
      ref: 'User.cart',
      // isRequired: true,
    }),
  },
});
