import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import 'dotenv/config';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { CartItem } from './schemas/CartItem';
import { extendGraphqlSchema } from './mutations';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';

const databaseURL =
  process.env.DATABASE_URL ||
  process.env.SICKFITS_DATABASE_URL ||
  'mongodb://localhost/keystone-sick-fits-tutorial';

// console.log('[keystone] (codespace) databaseURL: ', databaseURL);
// console.log('[keystone] (codespace) process.env: ', process.env);
// throw new Error('[keystone] exiting for testing...');

// TODO: set up a better, and fully-centralized, way to switch between local, codespace, and production
//       environments. This is a temporary hack to get the app to work in codespace development.
//       The way I am currently imagining it is setting up something like a switch statement or a chain
//       of if statements to determine the environment. When doing development in the codespace, a few of
//       the environment variables' names need to be prepended with SICKFITS_
//       (e.g. SICKFITS_DATABASE_URL, SICKFITS_COOKIE_SECRET, SICKFITS_FRONTEND_URL, etc.)

const sessionConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  secret: process.env.COOKIE_SECRET || process.env.SICKFITS_COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: add initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      console.log('[keystone] sending password reset link...', args);
      const res = await sendPasswordResetEmail(args.token, args.identity);
      console.log('[keystone] sendPasswordResetEmail() res:', res);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL || process.env.SICKFITS_FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('[keystone]: Connected to MongoDB');
        if (process.argv.includes('--seed-data')) {
          console.log('[keystone]: Seeding data...');
          await insertSeedData(keystone);
        }
      },
    },
    //   lists: createSchema(require('./lists')),
    lists: createSchema({
      // schema items go here
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema,
    ui: {
      // Show the UI only for users who pass this test
      isAccessAllowed: ({ session }) => {
        console.log('session:', session);
        return !!session?.data;
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // This is a GraphQL query that will be run against each session to get the
      // user data.
      User: `id name email role {${permissionsList.join(' ')}}`,
    }),
  })
);
