// @mui
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

type Props = Readonly<{
  headLabel: any[];
}>;

export default function CustomTableSkeleton({ headLabel }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={24}>
        <Stack spacing={3} direction="row" alignItems="center">
          {headLabel.map((headCell, index) => (
            <Skeleton
              key={index}
              sx={{
                width: headCell.width ? headCell.width : 1,
                height: 12,
                px: 5,
              }}
            />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
