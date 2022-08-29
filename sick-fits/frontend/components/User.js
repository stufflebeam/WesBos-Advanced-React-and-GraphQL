import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        # TODO: query for permissions and the cart once we have those
        # permissions
        # cart {
        #   id
        #   quantity
        #   item {
        #     id
        #     price
        #     image
        #     title
        #     description
        #   }
        # }
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
  //   const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  //   return {
  //     currentUser: data?.currentUser,
  //     loading,
  //     error,
  //   };
}
