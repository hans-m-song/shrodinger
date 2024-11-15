import Card from '@mui/material/Card';
import { PlaybookRun } from '@shrodinger/contracts';

export interface PlaybookRunCardProps {
  playbookRun: PlaybookRun;
}

export const PlaybookRunCard = (props: PlaybookRunCardProps) => (
  <Card>{props.playbookRun.status}</Card>
);
