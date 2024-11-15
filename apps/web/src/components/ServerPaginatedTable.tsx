import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DataGrid,
  DataGridProps,
  GridPaginationModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridValidRowModel,
} from '@mui/x-data-grid';

export interface ServerPaginatedTableToolbarProps {
  onRefresh?: () => void;
}

export const ServerPaginatedTableToolbar = (
  props: ServerPaginatedTableToolbarProps,
) => (
  <GridToolbarContainer sx={{ p: 1 }}>
    <GridToolbarColumnsButton slotProps={{ button: { variant: 'text' } }} />
    <GridToolbarFilterButton slotProps={{ button: { variant: 'text' } }} />
    <GridToolbarDensitySelector slotProps={{ button: { variant: 'text' } }} />
    <Box sx={{ flexGrow: 1 }} />
    <Button onClick={props.onRefresh} startIcon={<RefreshIcon />}>
      Refresh
    </Button>
  </GridToolbarContainer>
);

export interface ServerPaginatedTableProps<T extends GridValidRowModel>
  extends Omit<
    DataGridProps<T>,
    | 'rows'
    | 'rowCount'
    | 'initialState'
    | 'pagination'
    | 'paginationModel'
    | 'paginationMode'
    | 'paginationMeta'
    | 'onPaginationModelChange'
  > {
  rows: T[];
  pagination: GridPaginationModel;
  onPagination?: (pagination: GridPaginationModel) => void;
  onRefresh?: () => void;
}

export const ServerPaginatedTable = <T extends GridValidRowModel>(
  props: ServerPaginatedTableProps<T>,
) => {
  const { rows, pagination, onPagination, loading, ...dataGridProps } = props;

  const hasNextPage = pagination.pageSize === rows.length;
  const rowCount =
    rows?.length > 0 && rows.length < pagination.pageSize
      ? pagination.page * pagination.pageSize + rows.length
      : -1;

  return (
    <DataGrid
      loading={loading}
      slots={{
        toolbar: () => (
          <ServerPaginatedTableToolbar onRefresh={props.onRefresh} />
        ),
      }}
      slotProps={{
        loadingOverlay: {
          variant: 'skeleton',
          noRowsVariant: 'skeleton',
        },
      }}
      initialState={{
        pagination: {
          rowCount,
          meta: { hasNextPage },
          paginationModel: pagination,
        },
      }}
      rowCount={rowCount}
      onPaginationModelChange={onPagination}
      paginationModel={pagination}
      paginationMode="server"
      paginationMeta={{ hasNextPage }}
      pageSizeOptions={[10, 25, 50]}
      rows={rows}
      {...dataGridProps}
    />
  );
};
