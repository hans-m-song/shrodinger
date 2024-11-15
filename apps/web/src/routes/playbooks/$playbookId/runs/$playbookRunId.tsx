import { createFileRoute } from '@tanstack/react-router';
import { api } from '../../../../lib/api';
import { usePagination } from '../../../../lib/pagination.hook';
import { ErrorAlert } from '../../../../components/ErrorAlert';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { PlaybookRunCard } from '../../../../components/PlaybookRunCard';
import { PlaybookRunLogDisplay } from '../../../../components/PlaybookRunLogDisplay';

export const PlaybookRunDetails = () => {
  const { pagination } = usePagination({ pageSize: 100 });
  const { playbookId, playbookRunId } = Route.useParams();

  const playbookRun = api.useGetPlaybookRun({
    playbookId: Number(playbookId),
    playbookRunId: Number(playbookRunId),
  });

  const playbookRunLogs = api.useListPlaybookRunLogs({
    playbookId: Number(playbookId),
    playbookRunId: Number(playbookRunId),
    ...pagination,
  });

  if (playbookRun.error || playbookRunLogs.error) {
    console.error(
      'PlaybookRunDetails',
      playbookRun.error,
      playbookRunLogs.error,
    );
    return <ErrorAlert />;
  }

  if (playbookRun.isLoading) {
    return <Skeleton />;
  }

  if (!playbookRun.data?.body.data) {
    return <Alert severity="warning">Playbook run not found.</Alert>;
  }

  if (!playbookRunLogs.data?.body.data) {
    return <Alert severity="warning">Playbook run logs not found.</Alert>;
  }

  return (
    <Stack>
      <PlaybookRunCard playbookRun={playbookRun.data.body.data} />
      <PlaybookRunLogDisplay data={playbookRunLogs.data.body.data} />
    </Stack>
  );
};

export const Route = createFileRoute(
  '/playbooks/$playbookId/runs/$playbookRunId',
)({
  component: PlaybookRunDetails,
});
