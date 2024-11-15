import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './theme.tsx';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClientProvider } from './lib/api-provider.tsx';

const apiUri = import.meta.env.VITE_API_URI;
if (import.meta.env.DEV) {
  console.log(import.meta.env);
}

const client = new ApolloClient({
  uri: apiUri,
  cache: new InMemoryCache(),
});

const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('No root element found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider>
        {import.meta.env.DEV && (
          <ReactQueryDevtools buttonPosition="top-right" />
        )}
        {import.meta.env.DEV && (
          <TanStackRouterDevtools router={router} position="bottom-right" />
        )}
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
