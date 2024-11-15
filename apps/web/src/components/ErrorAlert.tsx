import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { RouterIconButton } from './Router';
import Stack from '@mui/material/Stack';

export interface ErrorAlertProps {
  message?: string;
}

export const ErrorAlert = (props: ErrorAlertProps) => (
  <Alert
    severity="error"
    action={
      <Stack direction="row">
        <RouterIconButton to="/$">
          <HomeIcon />
        </RouterIconButton>
        <Button
          color="error"
          endIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Stack>
    }
  >
    Something went wrong! {props.message}
  </Alert>
);
