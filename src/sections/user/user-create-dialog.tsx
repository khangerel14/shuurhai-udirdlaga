import type { DIALOG_TYPE } from 'src/types/common';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { z as zod } from 'zod';
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
import { formatUser, dialogTypeName } from 'src/utils/format-status';

import { useUserMutation } from 'src/actions/user';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { ROLE } from 'src/types/common';

type Props = Readonly<{
  dialogType: DIALOG_TYPE;
  dialog: UseBooleanReturn;
  refetch: () => void;
}>;

// -------------------------------------------------

type UserSchemaType = zod.infer<typeof UserSchema>;

const UserSchema = zod.object({
  role: zod.nativeEnum(ROLE).describe('Рол оруулна уу!'),
  firstName: zod.string().min(1, 'Нэр оруулна уу!'),
  lastName: zod.string().min(1, 'Овог нэр оруулна уу!'),
  email: zod.string().email('Мэйл хаяг оруулна уу!'),
  password: zod.string().min(6, 'Нууц үг багадаа 6 тэмдэгт оруулна уу!'),
  avatar: zod.string().optional(),
});

// -------------------------------------------------

export function UserCreateDialog({ dialogType, dialog, refetch }: Props) {
  const { executeUserMutation, loading } = useUserMutation();
  const defaultValues: UserSchemaType = {
    role: ROLE.DRIVER,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: undefined,
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

      const { message, success } = await executeUserMutation({
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        avatar: fileUrl === '' ? null : fileUrl,
      });

      if (success) {
        reset();
        refetch();
        dialog.onFalse();
      }
      handleRequest(message, success);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={dialog.value}
      onClose={dialog.onFalse}
      slotProps={{
        paper: {
          sx: { maxWidth: 420 },
        },
      }}
    >
      <DialogTitle>{dialogTypeName(dialogType, 'Хэрэглэгч')}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box>
            {/* <Stack direction="column" alignItems="center" justifyContent="center" spacing={3}>
              <Field.UploadAvatar name="avatar" />
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Зөвшөөрөгдсөн *.jpeg, *.jpg, *.png. Хамгийн их хэмжээ 5 MB байна.
              </Typography>
            </Stack> */}
            <Box sx={{ rowGap: 2, display: 'grid', pt: 1 }}>
              <Field.Select name="role" label="Хэрэглэгчийн статус" size="small">
                {Object.values(ROLE).map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatUser(status)}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="firstName" label="Нэр" size="small" />
              <Field.Text name="lastName" label="Овог" size="small" />
              <Field.Text name="email" label="Мэйл хаяг" size="small" />
              <Field.Text name="password" label="Нууц үг" size="small" />
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
          <Button type="submit" variant="contained" loading={isSubmitting || loading}>
            Хадгалах
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
