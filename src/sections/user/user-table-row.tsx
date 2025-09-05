import type { IUsers } from 'src/types/user';
import type { LabelColor } from 'src/components/label';
import type { IconifyProps } from 'src/components/iconify';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Button, TableRow, MenuList, MenuItem, TableCell, IconButton } from '@mui/material';

import { formatUser, formatStatus } from 'src/utils/format-status';

import { useChangeStatusUserMutation } from 'src/actions/user';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { DIALOG_TYPE, STATUS_ENUM } from 'src/types/common';

import { UserUpdateViewDialog } from './user-update-view-dialog';

type Props = Readonly<{
  row: IUsers;
  index: number;
  refetch: () => void;
}>;

export function UserTableRow({ row, index, refetch }: Props) {
  const popover = usePopover();
  const confirmDialog = useBoolean();
  const editDialog = useBoolean();
  const [dialogType, setDialogType] = useState(DIALOG_TYPE.UPDATE);

  const { loading, executeStatusUserMutation } = useChangeStatusUserMutation();

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
                executeStatusUserMutation({ rowId: row.id, status });
                popover.onClose();
              }}
            >
              <Iconify icon={formatStatus(status).icon as IconifyProps['icon']} />
              {formatStatus(status).text}
            </MenuItem>
          ))}
        <MenuItem
          onClick={() => {
            setDialogType(DIALOG_TYPE.VIEW);
            editDialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Харах
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDialogType(DIALOG_TYPE.UPDATE);
            editDialog.onTrue();
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
          Та <strong>{row?.firstName}</strong> -ийг устгахдаа итгэлтэй байна уу?
        </>
      }
      action={
        <Button
          color="error"
          loading={loading}
          variant="contained"
          onClick={() =>
            executeStatusUserMutation({ rowId: row.id, status: STATUS_ENUM.DELETED }).then(() => {
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
    <>
      <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{row?.firstName}</TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.phoneNumber}</TableCell>
        <TableCell>{formatUser(row?.role)}</TableCell>
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
      <UserUpdateViewDialog
        dialogType={dialogType}
        dialog={editDialog}
        refetch={refetch}
        currentRow={row}
      />
    </>
  );
}
