import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { isSignedIn, permissions, rules } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
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
