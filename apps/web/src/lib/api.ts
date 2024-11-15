import {
  playbookContract,
  playbookRunContract,
  playbookRunLogContract,
} from '@shrodinger/contracts';
import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { Pagination } from './pagination.hook';

export enum QueryKey {
  Playbooks = 'playbooks',
  PlaybookRuns = 'playbook-runs',
  PlaybookRunLogs = 'playbook-run-logs',
}

export const client = new QueryClient();

const playbooksClient = initTsrReactQuery(playbookContract, {
  baseUrl: import.meta.env.VITE_API_URI,
});

export const PlaybooksQueryProvider = playbooksClient.ReactQueryProvider;
export const usePlaybooksClient = playbooksClient.useQueryClient;

const playbookRunsClient = initTsrReactQuery(playbookRunContract, {
  baseUrl: import.meta.env.VITE_API_URI,
});

export const PlaybookRunsQueryProvider = playbookRunsClient.ReactQueryProvider;
export const usePlaybookRunsClient = playbookRunsClient.useQueryClient;

const playbookRunLogsClient = initTsrReactQuery(playbookRunLogContract, {
  baseUrl: import.meta.env.VITE_API_URI,
});

export const PlaybookRunLogsQueryProvider =
  playbookRunLogsClient.ReactQueryProvider;
export const usePlaybookRunLogsClient = playbookRunLogsClient.useQueryClient;

export const api = {
  useListPlaybooks: (args: Pagination) =>
    playbooksClient.listPlaybooks.useQuery({
      placeholderData: keepPreviousData,
      queryKey: [QueryKey.Playbooks, args],
      queryData: {
        query: {
          limit: args.pageSize,
          offset: args.page * args.pageSize,
        },
      },
    }),

  useGetPlaybook: (args: { playbookId: number }) =>
    playbooksClient.getPlaybook.useQuery({
      queryKey: [QueryKey.Playbooks, args.playbookId],
      queryData: {
        params: { playbookId: args.playbookId },
      },
    }),

  useListPlaybookRuns: (args: {
    playbookId: number;
    page: number;
    pageSize: number;
  }) =>
    playbookRunsClient.listPlaybookRuns.useQuery({
      placeholderData: keepPreviousData,
      queryKey: [
        QueryKey.Playbooks,
        args.playbookId,
        QueryKey.PlaybookRuns,
        { page: args.page, pageSize: args.pageSize },
      ],
      queryData: {
        params: {
          playbookId: args.playbookId,
        },
        query: {
          limit: args.pageSize,
          offset: args.page * args.pageSize,
        },
      },
    }),

  useGetPlaybookRun: (args: { playbookId: number; playbookRunId: number }) =>
    playbookRunsClient.getPlaybookRun.useQuery({
      queryKey: [
        QueryKey.Playbooks,
        args.playbookId,
        QueryKey.PlaybookRuns,
        args.playbookRunId,
      ],
      queryData: {
        params: {
          playbookId: args.playbookId,
          playbookRunId: args.playbookRunId,
        },
      },
    }),

  useListPlaybookRunLogs: (args: {
    playbookId: number;
    playbookRunId: number;
    page: number;
    pageSize: number;
  }) =>
    playbookRunLogsClient.listPlaybookRunLogs.useQuery({
      placeholderData: keepPreviousData,
      queryKey: [
        QueryKey.Playbooks,
        args.playbookId,
        QueryKey.PlaybookRuns,
        args.playbookRunId,
        QueryKey.PlaybookRunLogs,
        { page: args.page, pageSize: args.pageSize },
      ],
      queryData: {
        params: {
          playbookId: args.playbookId,
          playbookRunId: args.playbookRunId,
        },
        query: {
          limit: args.pageSize,
          offset: args.page * args.pageSize,
        },
      },
    }),
};
