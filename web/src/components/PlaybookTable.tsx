import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Playbook } from '../lib/playbooks';
// import TablePagination from '@mui/material/TablePagination';

export interface PlaybookTableProps {
  playbooks: Playbook[];
}

export const PlaybookTable = (props: PlaybookTableProps) => (
  <Paper>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow hover>
            <TableCell>Name</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.playbooks.map((playbook) => (
            <TableRow key={playbook.id} hover>
              <TableCell>{playbook.filepath}</TableCell>
              <TableCell>
                {new Date(playbook.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(playbook.updatedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {/* <TablePagination></TablePagination> */}
  </Paper>
);
