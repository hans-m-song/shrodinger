import { createFileRoute } from '@tanstack/react-router';
import { api } from '../../../lib/api';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { PlaybookCard } from '../../../components/PlaybookCard';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { PlaybookRunTable } from '../../../components/PlaybookRunTable';
import { usePagination } from '../../../lib/pagination.hook';
import Stack from '@mui/material/Stack';

export const PlaybookDetails = () => {
  const { playbookId } = Route.useParams();
  const { pagination } = usePagination();

  const playbook = api.useGetPlaybook({
    playbookId: Number(playbookId),
  });

  const playbookRuns = api.useListPlaybookRuns({
    playbookId: Number(playbookId),
    ...pagination,
  });

  const onPagination = (...args: unknown[]) => {
    console.log('PlaybookDetails.onPagination', args);
  };

  if (playbook.error || playbookRuns.error) {
    console.error('PlaybookDetails', playbook.error || playbookRuns.error);
    return <ErrorAlert />;
  }

  if (playbook.isLoading) {
    return <Skeleton variant="rectangular" />;
  }

  if (!playbook.data?.body.data) {
    return <Alert severity="warning">Playbook not found.</Alert>;
  }

  return (
    <Stack>
      <PlaybookCard active={false} playbook={playbook.data.body.data} />
      <PlaybookRunTable
        loading={playbookRuns.isLoading}
        rows={playbookRuns.data?.body.data ?? []}
        pagination={pagination}
        onPagination={onPagination}
        onRefresh={playbookRuns.refetch}
      />
    </Stack>
  );
};

export const Route = createFileRoute('/playbooks/$playbookId/')({
  component: PlaybookDetails,
});
