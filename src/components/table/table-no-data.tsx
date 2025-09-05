import type { Theme, SxProps } from '@mui/material/styles';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { EmptyContent } from '../empty-content';

// ----------------------------------------------------------------------

export type TableNoDataProps = Readonly<{
  notFound: boolean;
  sx?: SxProps<Theme>;
}>;

export function TableNoData({ notFound, sx }: TableNoDataProps) {
  return (
    <TableRow sx={{ height: '100%' }}>
      {notFound ? (
        <TableCell colSpan={12} sx={{ height: '100%' }}>
          <EmptyContent
            filled
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0, height: '100%' }} />
      )}
    </TableRow>
  );
}
