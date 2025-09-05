'use client';

import type { PropsWithChildren } from 'react';

import { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { from, HttpLink, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { CONFIG } from 'src/global-config';

import { STORAGE_KEY } from 'src/auth/context/jwt';

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: CONFIG.serverUrl,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem(STORAGE_KEY);
    }

    return {
      headers: {
        ...headers,
        Authorization: token ?? '',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.message.includes('401') && typeof window !== 'undefined') {
          sessionStorage.removeItem(STORAGE_KEY);
          window.location.href = '/auth/jwt/sign-in';
        }
      }
    }

    if (networkError) {
      if (networkError.message.includes('401') && typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = '/auth/jwt/sign-in';
      }
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    ssrMode: typeof window === 'undefined',
  });
}

export function ApolloWrapper({ children }: PropsWithChildren) {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export const client = createApolloClient();
