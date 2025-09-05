import type { IDriver } from 'src/types/driver';
import type { LabelColor } from 'src/components/label';
import type { IconifyProps } from 'src/components/iconify';

import dayjs from 'dayjs';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { Button, TableRow, MenuList, MenuItem, TableCell, IconButton } from '@mui/material';

import { formatStatus, formatDriverType } from 'src/utils/format-status';

import { useChangeStatusDriver } from 'src/actions/driver';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { DIALOG_TYPE, STATUS_ENUM } from 'src/types/common';

import { DriverUpdateViewDialog } from './driver-update-view-dialog';
import { DriverChangeTypeDialog } from './driver-change-type-dialog';
import { DriverCreateVehicleDialog } from './driver-create-vehicle-dialog';
import { DriverUpdateVehicleDialog } from './driver-update-vehicle-dialog';

type Props = Readonly<{
  row: IDriver;
  index: number;
  refetch: () => void;
  handleRowAction: (rowDialogType: DIALOG_TYPE, row?: IDriver) => void;
}>;

export function DriverTableRow({ row, index, refetch, handleRowAction }: Props) {
  const popover = usePopover();
  const editDialog = useBoolean();
  const typeDialog = useBoolean();
  const createVehicleDialog = useBoolean();
  const updateVehicleDialog = useBoolean();

  const confirmDialog = useBoolean();

  const { loading, executeChangeStatusDriver } = useChangeStatusDriver({ refetch });

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
                executeChangeStatusDriver({ rowId: row?.id, status });
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
            typeDialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:list-bold" />
          Төхөөрөмжийн төрөл солих
        </MenuItem>
        {row?.vehicle ? (
          <MenuItem
            onClick={() => {
              updateVehicleDialog.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Машин засах
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              createVehicleDialog.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Машин нэмэх
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            editDialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Засах
        </MenuItem>
        {row?.status !== STATUS_ENUM.DELETED && (
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
          Та <strong>{row?.user.firstName}</strong> -ийг устгахдаа итгэлтэй байна уу?
        </>
      }
      action={
        <Button
          color="error"
          loading={loading}
          variant="contained"
          onClick={() =>
            executeChangeStatusDriver({ rowId: row?.id, status: STATUS_ENUM.DELETED }).then(() => {
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
        <TableCell>{row?.user?.firstName}</TableCell>
        <TableCell>{row?.user?.phoneNumber}</TableCell>
        <TableCell>{row?.traccarDevice?.uniqueid}</TableCell>
        <TableCell>{formatDriverType(row?.type)}</TableCell>
        <TableCell>{row?.vehicle?.licencePlate}</TableCell>
        <TableCell>
          <Label variant="soft" color={formatStatus(row?.status).color as LabelColor}>
            {formatStatus(row?.status).text}
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
      <DriverCreateVehicleDialog dialog={createVehicleDialog} refetch={refetch} currentRow={row} />
      <DriverUpdateVehicleDialog dialog={updateVehicleDialog} refetch={refetch} currentRow={row} />
      <DriverChangeTypeDialog
        currentRow={row}
        refetch={refetch}
        dialog={typeDialog}
        dialogType={DIALOG_TYPE.UPDATE}
      />
      <DriverUpdateViewDialog
        dialogType={DIALOG_TYPE.UPDATE}
        dialog={editDialog}
        refetch={refetch}
        currentRow={row}
      />
    </>
  );
}
