import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@emotion/react';
import theme from './theme.ts';

const apiUri = import.meta.env.VITE_API_URI;
console.log(import.meta.env.VITE_GIT_SHA);

const client = new ApolloClient({ uri: apiUri, cache: new InMemoryCache() });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
