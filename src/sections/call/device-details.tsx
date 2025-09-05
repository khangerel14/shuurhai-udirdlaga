import type { IDriver } from 'src/types/driver';
import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { ISocketDevice, ISocketPosition } from 'src/types/socket';

import dayjs from 'dayjs';

import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  CardContent,
  TableContainer,
} from '@mui/material';

import { formatDeviceStatus } from 'src/utils/format-status';
import { CALL_DRIVER_TABLE_HEAD } from 'src/utils/table-header';

import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { CallDialog } from './call-dialog';

import type { SetLocationType } from './view/call-list-board-view';

type Props = Readonly<{
  count: number;
  loading: boolean;
  drivers: IDriver[];
  selected: number | null;
  dialog: UseBooleanReturn;
  location: SetLocationType | null;
  setSelected: (id: number) => void;
  socketDevices: ISocketDevice[];
  socketPositions: ISocketPosition[];
}>;

export const DeviceDetail = ({
  count,
  dialog,
  drivers,
  loading,
  location,
  selected,
  setSelected,
  socketDevices,
  socketPositions,
}: Props) => {
  const table = useTable();

  const renderSkeleton = (
    <>
      {[...Array(table.rowsPerPage)].map((_, index) => (
        <TableSkeleton key={index} rowCount={1} cellCount={CALL_DRIVER_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (socketDevices ?? []).map((row: ISocketDevice, index: number) => {
    const currentPosition = socketPositions?.find((pos) => pos.deviceId === row?.id);
    const currentPositionId = currentPosition?.id;

    return (
      <TableRow
        key={index}
        onClick={() => currentPositionId && setSelected(currentPositionId)}
        sx={selected === currentPositionId ? { bgcolor: 'action.selected' } : {}}
      >
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          {drivers?.find((driver: IDriver) => driver.traccarDevice.id === row?.id)?.user?.firstName}
        </TableCell>
        <TableCell>{row.uniqueId}</TableCell>
        <TableCell>{formatDeviceStatus(row.status)}</TableCell>
        <TableCell>{dayjs(row.lastUpdate).format('YYYY-MM-DD')}</TableCell>
      </TableRow>
    );
  });

  const hasDriverType = count !== 0;
  const tableContent = hasDriverType ? renderTable : <TableNoData notFound />;

  return (
    <>
      <Card>
        <CardHeader title="Жолоочын самбар" sx={{ p: 2 }} />
        <CardContent>
          <TableContainer>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  rowCount={count}
                  order={table.order}
                  onSort={table.onSort}
                  headCells={CALL_DRIVER_TABLE_HEAD}
                  orderBy={table.orderBy}
                  numSelected={table.selected.length}
                />
                <TableBody>{loading ? renderSkeleton : tableContent}</TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </CardContent>
      </Card>
      <CallDialog dialog={dialog} location={location} />
    </>
  );
};
