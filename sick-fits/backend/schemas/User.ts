import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  // access: {
  // ui:
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    // TODO: add roles, carts, and orders here
    // roles: relationship({ ref: 'Role', many: true }),
    // cart: relationship({ ref: 'Cart', many: true }),
    // orders: relationship({ ref: 'Order', many: true }),
  },
});