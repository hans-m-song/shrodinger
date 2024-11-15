import IconButton from '@mui/material/IconButton';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteIcon from '@mui/icons-material/Delete';
import { PlaybookRun } from '@shrodinger/contracts';
import { RouterIconButton } from './Router';
import {
  ServerPaginatedTable,
  ServerPaginatedTableProps,
} from './ServerPaginatedTable';

export interface PlaybookRunTableProps
  extends Omit<ServerPaginatedTableProps<PlaybookRun>, 'getRowId' | 'columns'> {
  onDelete?: (id: number) => void;
}

export const PlaybookRunTable = (props: PlaybookRunTableProps) => {
  const onDelete = (id: number) => () => {
    console.log('PlaybookRunTable.onDelete', id);
    props.onDelete?.(id);
  };

  return (
    <ServerPaginatedTable
      {...props}
      getRowId={(row) => row.playbookRunId}
      columns={[
        {
          field: 'status',
          headerName: 'Status',
        },
        {
          field: 'createdAt',
          headerName: 'Created',
          type: 'dateTime',
          width: 160,
          valueGetter: (_, row) => new Date(row.createdAt),
        },
        {
          field: 'updatedAt',
          headerName: 'Updated',
          type: 'dateTime',
          width: 160,
          valueGetter: (_, row) => new Date(row.updatedAt),
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          getActions: (params) => [
            <RouterIconButton
              key="open"
              to={`/playbooks/$playbookId/runs/$playbookRunId`}
              params={{
                playbookId: `${params.row.playbookId}`,
                playbookRunId: `${params.row.playbookRunId}`,
              }}
            >
              <ShortcutIcon />
            </RouterIconButton>,
            <IconButton key="delete" onClick={onDelete(params.row.playbookId)}>
              <DeleteIcon />
            </IconButton>,
          ],
        },
      ]}
    />
  );
};
