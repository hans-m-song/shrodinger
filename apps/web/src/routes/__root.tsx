import { Outlet, createRootRoute } from '@tanstack/react-router';
import Alert from '@mui/material/Alert';

export const Route = createRootRoute({
  notFoundComponent: () => <Alert severity="error">Not found</Alert>,
  component: Outlet,
});
