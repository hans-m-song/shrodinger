import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Playbook } from '@shrodinger/contracts';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

export interface PlaybookCardProps {
  playbook: Playbook;
  status?: string;
  onRun?: () => void;
  active?: boolean;
  onToggleActive?: () => void;
}

export const PlaybookCard = (props: PlaybookCardProps) => (
  <Card>
    <CardContent>
      <Stack>
        <Stack direction="row">
          <Typography style={{ verticalAlign: 'text-top' }}>
            {props.playbook.filepath}
          </Typography>
          <Chip label={`v${props.playbook.version}`} />
          <Tooltip title="Coming soon">
            <span style={{ display: 'flex' }}>
              <Button disabled>Load playbook contents</Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </CardContent>
    <CardActions>
      <Button
        onClick={props.onToggleActive}
        color={props.active ? 'error' : 'success'}
        endIcon={props.active ? <CloseIcon /> : <CheckIcon />}
      >
        {props.active ? 'Disable' : 'Enable'}
      </Button>
      <Button
        disabled={!props.active}
        variant="contained"
        onClick={props.onRun}
        endIcon={<PlayArrowIcon />}
      >
        Run
      </Button>
    </CardActions>
  </Card>
);
