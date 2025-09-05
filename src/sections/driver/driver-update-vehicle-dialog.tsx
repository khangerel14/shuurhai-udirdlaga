import type { IDriver } from 'src/types/driver';
import type { VehicleModel } from 'src/types/vehicle-model';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { dialogTypeName } from 'src/utils/format-status';

import Loading from 'src/app/loading';
import { useCreateUpdateVehicleMutation } from 'src/actions/driver';
import { useGetVehicleModelsQuery } from 'src/actions/vehicle-model';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE } from 'src/types/common';

const UpdateSchema = zod.object({
  updateVehicleId: zod.string().min(1, 'Төрөл сонгоно уу!'),
  vehicleModelId: zod.string().min(1, 'Төрөл сонгоно уу!'),
  licencePlate: zod.string().min(1, 'Машины улсын дугаар оруулна уу!'),
  certificate: zod.string().min(1, 'Машины гэрчилгээ оруулна уу!'),
  color: zod.string().min(1, 'Өнгө оруулна уу!'),
  importDate: zod.string().min(1, 'Орж ирсэн огноо оруулна уу!'),
});

type UpdateSchemaType = zod.infer<typeof UpdateSchema>;

type Props = Readonly<{
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: IDriver | null;
}>;

export function DriverUpdateVehicleDialog({ dialog, refetch, currentRow }: Props) {
  const { executeCreateUpdateVehicle, loading } = useCreateUpdateVehicleMutation({
    row: currentRow,
  });

  const { datas: models, loading: modelsLoading } = useGetVehicleModelsQuery({
    open: dialog.value,
  });

  const defaultValues = useMemo(() => {
    let importDate = '';
    if (currentRow?.vehicle?.importDate) {
      if (typeof currentRow.vehicle.importDate === 'string') {
        importDate = currentRow.vehicle.importDate;
      } else {
        importDate = currentRow.vehicle.importDate.toISOString().split('T')[0];
      }
    }
    return {
      vehicleModelId: currentRow?.vehicle?.vehicleModel?.id ?? '',
      updateVehicleId: currentRow?.vehicle?.id ?? '',
      licencePlate: currentRow?.vehicle?.licencePlate ?? '',
      certificate: currentRow?.vehicle?.certificate ?? '',
      color: currentRow?.vehicle?.color ?? '',
      importDate,
    };
  }, [currentRow]);

  const methods = useForm<UpdateSchemaType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(UpdateSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    let importDate = '';
    if (currentRow?.vehicle?.importDate) {
      if (typeof currentRow.vehicle.importDate === 'string') {
        importDate = currentRow.vehicle.importDate;
      } else {
        importDate = currentRow.vehicle.importDate.toISOString().split('T')[0];
      }
    }
    reset({
      vehicleModelId: currentRow?.vehicle?.vehicleModel?.id ?? '',
      updateVehicleId: currentRow?.vehicle?.id ?? '',
      licencePlate: currentRow?.vehicle?.licencePlate ?? '',
      certificate: currentRow?.vehicle?.certificate ?? '',
      color: currentRow?.vehicle?.color ?? '',
      importDate,
    });
  }, [dialog.value, currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeCreateUpdateVehicle({
        variables: {
          ...data,
          certificate: data.certificate ?? '',
          color: data.color ?? '',
          importDate: data.importDate ?? '',
        },
      });

      if (success) {
        reset();
        refetch();
        dialog.onFalse();
      }

      handleRequest(message, success);
    } catch (error) {
      handleRequest(`Алдаа гарлаа: ${error}`, false);
    }
  });

  const handleClose = () => {
    dialog.onFalse();
    reset();
  };

  if (modelsLoading) return <Loading />;

  return (
    <Dialog fullWidth maxWidth="sm" open={dialog.value} onClose={handleClose}>
      <DialogTitle>{dialogTypeName(DIALOG_TYPE.UPDATE, 'Машин')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <Field.Select
              name="vehicleModelId"
              label="Машины модел"
              size="small"
              disabled={loading}
            >
              {models?.map((model: VehicleModel) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="licencePlate" label="Машины номер" size="small" disabled={loading} />
            <Field.Text name="certificate" label="Гэрчилгээ" size="small" disabled={loading} />
            <Field.Text name="color" label="Машины өнгө" size="small" disabled={loading} />
            <Field.DatePicker name="importDate" label="Орж ирсэн он" disabled={loading} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} disabled={isSubmitting || loading}>
            Хаах
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Хадгалах
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
