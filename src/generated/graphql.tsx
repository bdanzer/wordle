import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  googleSignIn: User;
};


export type MutationGoogleSignInArgs = {
  googleToken: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getUser: User;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, createdAt: string, updatedAt?: string | null } };

export type GoogleSignInMutationVariables = Exact<{
  googleToken: Scalars['String'];
}>;


export type GoogleSignInMutation = { __typename?: 'Mutation', googleSignIn: { __typename?: 'User', id: string, firstName: string, email: string, lastName: string, createdAt: string, updatedAt?: string | null } };


export const GetUserDocument = gql`
    query GetUser {
  getUser {
    id
    firstName
    lastName
    email
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GoogleSignInDocument = gql`
    mutation GoogleSignIn($googleToken: String!) {
  googleSignIn(googleToken: $googleToken) {
    id
    firstName
    email
    lastName
    createdAt
    updatedAt
  }
}
    `;
export type GoogleSignInMutationFn = Apollo.MutationFunction<GoogleSignInMutation, GoogleSignInMutationVariables>;

/**
 * __useGoogleSignInMutation__
 *
 * To run a mutation, you first call `useGoogleSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleSignInMutation, { data, loading, error }] = useGoogleSignInMutation({
 *   variables: {
 *      googleToken: // value for 'googleToken'
 *   },
 * });
 */
export function useGoogleSignInMutation(baseOptions?: Apollo.MutationHookOptions<GoogleSignInMutation, GoogleSignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleSignInMutation, GoogleSignInMutationVariables>(GoogleSignInDocument, options);
      }
export type GoogleSignInMutationHookResult = ReturnType<typeof useGoogleSignInMutation>;
export type GoogleSignInMutationResult = Apollo.MutationResult<GoogleSignInMutation>;
export type GoogleSignInMutationOptions = Apollo.BaseMutationOptions<GoogleSignInMutation, GoogleSignInMutationVariables>;