import { list } from '@keystone-next/keystone/schema';
import {
  integer,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  // TODO: Figure out why this label declaration is not working. Althought it does not appear to be
  //       breaking anything when uncommented, it is not showing up in the admin UI.
  // label: virtual({
  //   graphQLReturnType: 'String',
  //   resolver(item) {
  //     return `Order ${item.name} - ${formatMoney(item.price * item.quantity)}`;
  //   },
  // }),
  ui: {
    listView: {
      initialColumns: ['user', 'total', 'items', 'charge'],
    },
  },
  fields: {
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
