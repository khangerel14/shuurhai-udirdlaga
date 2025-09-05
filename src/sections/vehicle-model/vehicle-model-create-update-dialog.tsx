import type { VehicleType } from 'src/types/vehicle-type';
import type { VehicleModel } from 'src/types/vehicle-model';
import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { VehicleManufacture } from 'src/types/vehicle-manufacture';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, MenuItem, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { dialogTypeName } from 'src/utils/format-status';

import { useGetVehicleTypesQuery } from 'src/actions/vehicle-type';
import { useGetManufacturesQuery } from 'src/actions/vehicle-manufacture';
import { useCreateUpdateVehicleModelMutation } from 'src/actions/vehicle-model';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: VehicleModel | null;
}>;

// -------------------------------------------------

type VehicleModelSchemaType = zod.infer<typeof VehicleModelSchema>;

const VehicleModelSchema = zod.object({
  name: zod.string().min(1, 'Нэр оруулна уу!'),
  vehicleTypeId: zod.string().min(1, 'Төрөл сонгоно уу!'),
  vehicleManufactureId: zod.string().min(1, 'Үйлдвэрлэгч сонгоно уу!'),
});

// -------------------------------------------------

export function VehicleModelCreateUpdateViewDialog({
  dialogType,
  dialog,
  refetch,
  currentRow,
}: Props) {
  const { executeCreateUpdateVehicleModelMutation, loading } = useCreateUpdateVehicleModelMutation({
    currentRow,
    dialogType,
  });

  const { datas: vehicleTypes } = useGetVehicleTypesQuery({ open: dialog.value });
  const { datas: vehicleManufactures } = useGetManufacturesQuery({ open: dialog.value });

  const defaultValues: VehicleModelSchemaType = useMemo(
    () => ({
      name: '',
      vehicleTypeId: '',
      vehicleManufactureId: '',
    }),
    []
  );

  const methods = useForm<VehicleModelSchemaType>({
    mode: 'all',
    resolver: zodResolver(VehicleModelSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (dialogType === DIALOG_TYPE.CREATE) {
      reset({ name: '', vehicleTypeId: '', vehicleManufactureId: '' });
    } else if (currentRow) {
      reset({
        name: currentRow.name,
        vehicleTypeId: currentRow.vehicleType.id,
        vehicleManufactureId: currentRow.vehicleManufacture.id,
      });
    }
  }, [dialogType, currentRow, reset, dialog.value]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeCreateUpdateVehicleModelMutation({
        name: data.name,
        vehicleTypeId: data.vehicleTypeId,
        vehicleManufactureId: data.vehicleManufactureId,
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
      <DialogTitle>{dialogTypeName(dialogType, 'Тээврийн хэрэгсэлийн модел')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}>
          <Field.Text
            name="name"
            label="Нэр"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Field.Select
            name="vehicleTypeId"
            label="Төрөл"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
          >
            {vehicleTypes?.map((vehicleType: VehicleType) => (
              <MenuItem key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.name}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Select
            name="vehicleManufactureId"
            label="Үйлдвэрлэгч"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
          >
            {vehicleManufactures?.map((vehicleType: VehicleManufacture) => (
              <MenuItem key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.name}
              </MenuItem>
            ))}
          </Field.Select>
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
