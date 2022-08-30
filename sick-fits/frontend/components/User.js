import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// TODO: query for permissions once we have those
export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        cart {
          id
          quantity
          product {
            id
            name
            price
            description
            photo {
              altText
              image {
                publicUrlTransformed
              }
            }
          }
        }
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
