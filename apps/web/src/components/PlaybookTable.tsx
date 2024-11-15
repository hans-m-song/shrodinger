import IconButton from '@mui/material/IconButton';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteIcon from '@mui/icons-material/Delete';
import { Playbook } from '@shrodinger/contracts';
import { RouterIconButton } from './Router';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import {
  ServerPaginatedTable,
  ServerPaginatedTableProps,
} from './ServerPaginatedTable';

export interface PlaybookTableProps
  extends Omit<ServerPaginatedTableProps<Playbook>, 'getRowId' | 'columns'> {
  onDelete?: (id: number) => void;
}

export const PlaybookTable = (props: PlaybookTableProps) => {
  const onDelete = (id: number) => () => {
    console.log('PlaybookTable.onDelete', id);
    props.onDelete?.(id);
  };

  return (
    <ServerPaginatedTable
      {...props}
      getRowId={(row) => row.playbookId}
      columns={[
        {
          field: 'filepath',
          headerName: 'Filepath',
        },
        {
          field: 'version',
          headerName: 'Version',
          renderCell: (params) => <Chip label={`v${params.row.version}`} />,
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
            <Tooltip key="open" title="Open playbook">
              <RouterIconButton
                to={`/playbooks/$playbookId`}
                params={{ playbookId: `${params.row.playbookId}` }}
              >
                <ShortcutIcon />
              </RouterIconButton>
            </Tooltip>,
            <Tooltip key="delete" title="Delete playbook">
              <IconButton
                key="delete"
                onClick={onDelete(params.row.playbookId)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
          ],
        },
      ]}
    />
  );
};
