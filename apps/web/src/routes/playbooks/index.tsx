import { createFileRoute } from '@tanstack/react-router';
import { api } from '../../lib/api';
import { PlaybookTable } from '../../components/PlaybookTable';
import { Pagination, usePagination } from '../../lib/pagination.hook';
import { ErrorAlert } from '../../components/ErrorAlert';
import { z } from 'zod';

export const PlaybooksPageSearchSchema = z.object({
  page: z.number().int().min(0).default(0),
  sort: z.enum(['createdAt', 'updatedAt']).default('updatedAt').optional(),
});

export const PlaybooksPage = () => {
  const search = Route.useSearch();
  const { pagination, setPagination } = usePagination({ page: search.page });

  const { isLoading, error, data, refetch } = api.useListPlaybooks(pagination);

  const onPagination = (page: Pagination) => {
    setPagination(page);
  };

  if (error) {
    return <ErrorAlert />;
  }

  return (
    <PlaybookTable
      loading={isLoading}
      rows={data?.body.data ?? []}
      pagination={pagination}
      onPagination={onPagination}
      onRefresh={refetch}
    />
  );
};

export const Route = createFileRoute('/playbooks/')({
  validateSearch: PlaybooksPageSearchSchema.parse,
  component: PlaybooksPage,
});
