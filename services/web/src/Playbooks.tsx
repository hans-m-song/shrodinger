import { Container, Stack, Typography } from '@mui/material';
import { PlaybookTable } from './components/PlaybookTable';
import { Playbook } from './lib/playbooks';

export interface PlaybooksProps {
  playbooks: Playbook[];
}

export const Playbooks = (props: PlaybooksProps) => (
  <Container>
    <Stack>
      <Typography variant="h4">Index</Typography>
      <PlaybookTable playbooks={props.playbooks} />
    </Stack>
  </Container>
);
