import type { IDriver } from 'src/types/driver';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fileAttach } from 'src/utils/file';
import { dialogTypeName, formatDriverType } from 'src/utils/format-status';

import { useDriverMutation } from 'src/actions/driver';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE, DRIVER_TYPE_ENUM } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
  currentRow?: IDriver | null;
}>;

type UserSchemaType = zod.infer<typeof UserSchema>;

const UserSchema = zod.object({
  firstName: zod.string().min(1, 'Нэр оруулна уу!'),
  lastName: zod.string().min(1, 'Овог нэр оруулна уу!'),
  phoneNumber: zod
    .string()
    .min(8, 'Утасны дугаар багадаа 8 тэмдэгт оруулна уу!')
    .max(8, 'Утасны дугаар 8 тэмдэгтээс ихгүй байна!'),
  password: zod.string().min(6, 'Нууц үг багадаа 6 тэмдэгт оруулна уу'),
  driverData: zod.object({
    type: zod.nativeEnum(DRIVER_TYPE_ENUM).describe('Жолоочын төрөл оруулна уу!'),
  }),
  deviceId: zod.string().min(1, 'Төхөөрөмжийн ID оруулна уу!'),
  avatar: zod.string().nullable().optional(),
});

export function DriverCreateViewDialog({ dialogType, dialog, refetch, currentRow }: Props) {
  const { executeDriverMutation, loading } = useDriverMutation();

  const defaultValues: UserSchemaType = {
    driverData: { type: DRIVER_TYPE_ENUM.AMBULANCE },
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    avatar: null,
    deviceId: '',
  };

  const methods = useForm<UserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentRow) {
      reset(currentRow.user);
    }
  }, [currentRow, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let fileUrl = '';

      if (data.avatar && typeof data.avatar === 'object' && 'name' in data.avatar) {
        const uploadResult = await fileAttach(data.avatar);
        if (!uploadResult.success) {
          handleRequest('Файл хуулахад алдаа гарлаа', false);
          return;
        }
        fileUrl = uploadResult.url;
      } else if (typeof data.avatar === 'string') {
        fileUrl = data.avatar;
      }

      const { message, success } = await executeDriverMutation({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        password: data.password,
        driverData: {
          type: data.driverData.type,
        },
        deviceId: data.deviceId,
        avatar: fileUrl === '' ? null : fileUrl,
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
      <DialogTitle>{dialogTypeName(dialogType, 'Жолооч')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box>
            {/* <Stack direction="column" alignItems="center" justifyContent="center" spacing={3}>
              <Field.UploadAvatar name="avatar" disabled={dialogType === DIALOG_TYPE.VIEW} />
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Зөвшөөрэгдсөн *.jpeg, *.jpg, *.png. Хамгийн их хэмжээ 5 MB байна.
              </Typography>
            </Stack> */}
            <Box sx={{ rowGap: 2, display: 'grid', pt: 1 }}>
              {dialogType !== DIALOG_TYPE.VIEW && (
                <Field.Select name="driverData.type" label="Төрөл" size="small">
                  {Object.values(DRIVER_TYPE_ENUM).map((driverType: DRIVER_TYPE_ENUM) => (
                    <MenuItem key={driverType} value={driverType}>
                      {formatDriverType(driverType)}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}
              <Field.Text
                name="lastName"
                label="Овог"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Text
                name="firstName"
                label="Нэр"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Text
                name="phoneNumber"
                label="Утасны дугаар"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Text
                name="deviceId"
                label="Төхөөрөмжийн ID"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              {dialogType !== DIALOG_TYPE.VIEW && (
                <Field.Text name="password" label="Нууц үг" size="small" type="password" />
              )}
            </Box>
          </Box>
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
