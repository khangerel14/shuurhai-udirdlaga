import type { ICall } from 'src/types/call';
import type { LabelColor } from 'src/components/label';

import dayjs from 'dayjs';

import { TableRow, TableCell } from '@mui/material';

import { formatStatus, formatDriverType } from 'src/utils/format-status';

import { Label } from 'src/components/label';

type Props = Readonly<{
  row: ICall;
  index: number;
}>;

export function CallTableRow({ row, index }: Props) {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row?.district?.name}</TableCell>
      <TableCell>{row?.subDistrict?.name}</TableCell>
      <TableCell>{row?.street}</TableCell>
      <TableCell>{formatDriverType(row?.type)}</TableCell>
      <TableCell>
        <Label variant="soft" color={formatStatus(row?.status).color as LabelColor}>
          {formatStatus(row?.status).text}
        </Label>
      </TableCell>
      <TableCell>{dayjs(row.createdAt).format('YYYY-MM-DD')}</TableCell>
      <TableCell>{dayjs(row.updatedAt).format('YYYY-MM-DD')}</TableCell>
    </TableRow>
  );
}
