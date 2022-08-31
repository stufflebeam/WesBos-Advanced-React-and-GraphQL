import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';

// Create a fake GraphQL tagged template literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
    typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID!): CartItem
    }
  `,
    resolvers: {
        Mutation: {
            addToCart,
        },
    },
});
