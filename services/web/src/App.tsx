import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { PlaybookTable } from './components/PlaybookTable';
import { useListPlaybooksQuery } from './lib/playbooks';

export const App = () => {
  const { loading, error, data } = useListPlaybooksQuery({
    offset: 0,
    limit: 5,
  });

  console.log({ loading, error, data });

  return (
    <Container>
      <Stack>
        <Typography variant="h4">Playbooks</Typography>
        {error && <Typography>An error occurred!</Typography>}
        {loading && <LinearProgress />}
        {data && <PlaybookTable playbooks={data} />}
      </Stack>
    </Container>
  );
};
