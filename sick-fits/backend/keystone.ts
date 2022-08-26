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

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  secret: process.env.COOKIE_SECRET,
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
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
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
    }),
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
      User: 'id name email',
    }),
  })
);
