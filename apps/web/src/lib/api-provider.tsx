import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import {
  client,
  PlaybookRunLogsQueryProvider,
  PlaybookRunsQueryProvider,
  PlaybooksQueryProvider,
} from './api';

export const QueryClientProvider = (props: PropsWithChildren) => (
  <ReactQueryClientProvider client={client}>
    <PlaybooksQueryProvider>
      <PlaybookRunsQueryProvider>
        <PlaybookRunLogsQueryProvider>
          {props.children}
        </PlaybookRunLogsQueryProvider>
      </PlaybookRunsQueryProvider>
    </PlaybooksQueryProvider>
  </ReactQueryClientProvider>
);
