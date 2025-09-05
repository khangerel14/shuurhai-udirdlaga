import type { LabelColor } from 'src/components/label';
import type { ICityType } from 'src/types/location-city';
import type { IconifyProps } from 'src/components/iconify';

import dayjs from 'dayjs';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Button, TableRow, MenuList, MenuItem, TableCell, IconButton } from '@mui/material';

import { formatStatus } from 'src/utils/format-status';

import { useChangeStatusCityMutation } from 'src/actions/location-city';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { DIALOG_TYPE, STATUS_ENUM } from 'src/types/common';

type Props = Readonly<{
  row: ICityType;
  index: number;
  refetch: () => void;
  handleRowAction: (rowDialogType: DIALOG_TYPE, row?: ICityType) => void;
}>;

export function LocationCityTableRow({ row, index, refetch, handleRowAction }: Props) {
  const popover = usePopover();
  const confirmDialog = useBoolean();

  const { loading, executeChangeStatusCity } = useChangeStatusCityMutation({ refetch });

  const renderMenuActions = () => (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        {Object.values(STATUS_ENUM)
          .filter((status) => status !== STATUS_ENUM.DELETED && row.status !== status)
          .map((status) => (
            <MenuItem
              key={status}
              onClick={() => {
                executeChangeStatusCity({ rowId: row.id, status });
                popover.onClose();
              }}
            >
              <Iconify icon={formatStatus(status).icon as IconifyProps['icon']} />
              {formatStatus(status).text}
            </MenuItem>
          ))}
        <MenuItem
          onClick={() => {
            handleRowAction(DIALOG_TYPE.VIEW, row);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Харах
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleRowAction(DIALOG_TYPE.UPDATE, row);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Засах
        </MenuItem>
        {row.status !== STATUS_ENUM.DELETED && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              confirmDialog.onTrue();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Устгах
          </MenuItem>
        )}
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Устгах"
      content={
        <>
          Та <strong>{row.name}</strong> -ийг устгахдаа итгэлтэй байна уу?
        </>
      }
      action={
        <Button
          color="error"
          loading={loading}
          variant="contained"
          onClick={() =>
            executeChangeStatusCity({ rowId: row.id, status: STATUS_ENUM.DELETED }).then(() => {
              confirmDialog.onFalse();
              refetch();
            })
          }
        >
          Устгах
        </Button>
      }
    />
  );

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        <Label variant="soft" color={formatStatus(row.status).color as LabelColor}>
          {formatStatus(row.status).text}
        </Label>
      </TableCell>
      <TableCell>{dayjs(row.createdAt).format('YYYY-MM-DD')}</TableCell>
      <TableCell>{dayjs(row.updatedAt).format('YYYY-MM-DD')}</TableCell>
      <TableCell>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      {renderConfirmDialog()}
      {renderMenuActions()}
    </TableRow>
  );
}
