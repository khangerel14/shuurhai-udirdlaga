import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { IDistrictType } from 'src/types/location-district';
import type { ICommitteeType } from 'src/types/location-committee';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, MenuItem, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { dialogTypeName } from 'src/utils/format-status';

import { useGetDistrictsQuery } from 'src/actions/location-district';
import { useCreateOrUpdateCommitteeMutation } from 'src/actions/location-committee';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: ICommitteeType | null;
}>;

// -------------------------------------------------

type VehicleTypeSchemaType = zod.infer<typeof VehicleTypeSchema>;

const VehicleTypeSchema = zod.object({
  name: zod.string().min(1, 'Нэр оруулна уу!'),
  districtId: zod.string().min(1, 'Дүүрэг болон сум сонгоно уу!'),
});

// -------------------------------------------------

export function LocationCommitteeCreateUpdateViewDialog({
  dialogType,
  dialog,
  refetch,
  currentRow,
}: Props) {
  const { datas: districts } = useGetDistrictsQuery({ open: dialog.value });
  const { executeCommitteeMutation, loading } = useCreateOrUpdateCommitteeMutation({
    currentRow,
  });

  const defaultValues: VehicleTypeSchemaType = useMemo(
    () => ({
      name: currentRow?.name ?? '',
      districtId: currentRow?.district?.id ?? '',
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
        districtId: currentRow.district?.id ?? '',
      });
    }
  }, [currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeCommitteeMutation({
        name: data.name,
        districtId: data.districtId,
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
      <DialogTitle>{dialogTypeName(dialogType, 'Баг болон хороо')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Field.Select
            name="districtId"
            label="Дүүрэг болон сум"
            size="small"
            disabled={dialogType === DIALOG_TYPE.VIEW}
          >
            {districts?.map((city: IDistrictType) => (
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
