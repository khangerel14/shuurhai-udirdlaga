'use client';

import type { IDriver } from 'src/types/driver';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Dialog, MenuItem, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { dialogTypeName, formatDriverType } from 'src/utils/format-status';

import { useUpdateDriverMutation } from 'src/actions/driver';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE, DRIVER_TYPE_ENUM } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: IDriver;
}>;

export function DriverChangeTypeDialog({ dialogType, dialog, refetch, currentRow }: Props) {
  const { executeUpdateDriver, loading } = useUpdateDriverMutation();

  const defaultValues = {
    Id: currentRow?.id ?? '',
    driverData: { type: '' },
    deviceId: currentRow?.device_id ?? '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentRow) {
      reset({
        Id: currentRow.id,
        driverData: { type: currentRow.type ?? '' },
        deviceId: currentRow.traccarDevice.uniqueid ?? '',
      });
    }
  }, [currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeUpdateDriver({
        rowId: data.Id,
        type: data.driverData.type,
        deviceId: data.deviceId,
      });
      if (success) {
        reset();
        refetch();
        dialog.onFalse();
      }
      handleRequest(message, success);
    } catch (error) {
      handleRequest('Алдаа гарлаа: ' + error, false);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={dialog.value}
      onClose={() => {
        dialog.onFalse();
        reset();
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 420 },
        },
      }}
    >
      <DialogTitle>{dialogTypeName(dialogType, 'Төрөл')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Field.Select name="driverData.type" label="Төрөл" size="small">
            {Object.values(DRIVER_TYPE_ENUM)?.map((driverType: DRIVER_TYPE_ENUM) => (
              <MenuItem key={driverType} value={driverType}>
                {formatDriverType(driverType)}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="deviceId" label="Төхөөрөмжийн ID" size="small" />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              dialog.onFalse();
              reset();
            }}
          >
            Хаах
          </Button>
          {dialogType !== DIALOG_TYPE.VIEW && (
            <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
              Хадгалах
            </Button>
          )}
        </DialogActions>
      </Form>
    </Dialog>
  );
}
