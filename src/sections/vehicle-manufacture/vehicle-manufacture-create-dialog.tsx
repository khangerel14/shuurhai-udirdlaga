import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { VehicleManufacture } from 'src/types/vehicle-manufacture';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { dialogTypeName } from 'src/utils/format-status';

import { useCreateUpdateVehicleManufacture } from 'src/actions/vehicle-manufacture';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: VehicleManufacture | null;
}>;

// -------------------------------------------------

type VehicleTypeSchemaType = zod.infer<typeof VehicleTypeSchema>;

const VehicleTypeSchema = zod.object({
  name: zod.string().min(1, 'Нэр оруулна уу!'),
});

// -------------------------------------------------

export function VehicleManufactureCreateUpdateViewDialog({
  dialogType,
  dialog,
  refetch,
  currentRow,
}: Props) {
  const { executeCreateUpdateVehicleManufacture, loading } = useCreateUpdateVehicleManufacture({
    currentRow,
    dialogType,
  });

  const defaultValues: VehicleTypeSchemaType = useMemo(
    () => ({
      name: dialogType === DIALOG_TYPE.CREATE ? '' : (currentRow?.name ?? ''),
    }),
    [dialogType, currentRow]
  );

  const methods = useForm<VehicleTypeSchemaType>({
    mode: 'all',
    resolver: zodResolver(VehicleTypeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (dialogType === DIALOG_TYPE.CREATE) {
      reset({ name: '' });
    } else if (currentRow) {
      reset(currentRow);
    }
  }, [dialogType, currentRow, reset, dialog.value]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeCreateUpdateVehicleManufacture({
        name: data.name,
      });

      if (success) {
        reset(defaultValues);
        refetch();
        dialog.onFalse();
      }
      handleRequest(message, success);
    } catch (error) {
      console.error('Submission error:', error);
      handleRequest('Алдаа гарлаа: Сервертэй холбогдоход алдаа гарлаа', false);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={dialog.value}
      onClose={() => {
        dialog.onFalse();
        reset(defaultValues);
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 420 },
        },
      }}
    >
      <DialogTitle>{dialogTypeName(dialogType, 'Тээврийн хэрэгсэлийн үйлдвэр')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Field.Text
            name="name"
            label="Нэр"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              dialog.onFalse();
              reset(defaultValues);
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
