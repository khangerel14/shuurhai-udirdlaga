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
import { formatGender, dialogTypeName } from 'src/utils/format-status';

import { useDriverUpdateMutation } from 'src/actions/driver';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { DIALOG_TYPE, GENDER_ENUM } from 'src/types/common';

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
  avatar: zod.string().nullable().optional(),
  gender: zod.nativeEnum(GENDER_ENUM),
});

export function DriverUpdateViewDialog({ dialogType, dialog, refetch, currentRow }: Props) {
  const { executeUpdateDriverMutation, loading } = useDriverUpdateMutation();

  const defaultValues: UserSchemaType = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: null,
    gender: GENDER_ENUM.MALE,
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

      const { message, success } = await executeUpdateDriverMutation({
        updateUserId: currentRow?.user?.id ?? '',
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        avatar: fileUrl === '' ? null : fileUrl,
        gender: data.gender,
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
              <Field.Text
                name="firstName"
                label="Нэр"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Text
                name="lastName"
                label="Овог"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Text
                name="phoneNumber"
                label="Утасны дугаар"
                size="small"
                type="text"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              />
              <Field.Select
                name="gender"
                label="Хүйс"
                size="small"
                disabled={dialogType === DIALOG_TYPE.VIEW}
              >
                {Object.values(GENDER_ENUM).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {formatGender(gender)}
                  </MenuItem>
                ))}
              </Field.Select>
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
