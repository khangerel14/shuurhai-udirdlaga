import type { ICityType } from 'src/types/location-city';
import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { IDistrictType } from 'src/types/location-district';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, MenuItem, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { dialogTypeName } from 'src/utils/format-status';

import { useCreateOrUpdateDistrictMutation } from 'src/actions/location-district';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE } from 'src/types/common';

type Props = Readonly<{
  cities: ICityType[];
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: IDistrictType | null;
}>;

// -------------------------------------------------

type VehicleTypeSchemaType = zod.infer<typeof VehicleTypeSchema>;

const VehicleTypeSchema = zod.object({
  name: zod.string().min(1, 'Нэр оруулна уу!'),
  cityId: zod.string().min(1, 'Хот сонгоно уу!'),
});

// -------------------------------------------------

export function LocationDistrictCreateUpdateViewDialog({
  cities,
  dialogType,
  dialog,
  refetch,
  currentRow,
}: Props) {
  const { executeDistrictMutation, loading } = useCreateOrUpdateDistrictMutation({
    currentRow,
  });

  const defaultValues: VehicleTypeSchemaType = useMemo(
    () => ({
      name: currentRow?.name ?? '',
      cityId: currentRow?.city?.id ?? '',
    }),
    [currentRow]
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
    if (currentRow) {
      reset({
        name: currentRow.name,
        cityId: currentRow.city?.id ?? '',
      });
    }
  }, [currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeDistrictMutation({
        name: data.name,
        cityId: data.cityId,
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
      <DialogTitle>{dialogTypeName(dialogType, 'Дүүрэг болон сум')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Field.Select
            name="cityId"
            label="Хот"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
          >
            {cities?.map((city: ICityType) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Field.Select>
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
