import { z as zod } from 'zod';

import { LEVEL_ENUM, GENDER_ENUM, DRIVER_TYPE_ENUM } from 'src/types/common';

export const AmbulanceSchema = zod.object({
  callerPhoneNumber: zod
    .string({ required_error: 'Утасны дугаар оруулна уу!' })
    .min(8, 'Утасны дугаар багадаа 8 тэмдэгт оруулна уу!')
    .regex(/^\d+$/, 'Утасны дугаар зөвхөн тооноос бүрдэх ёстой!'),
  address: zod.string({ required_error: 'Хаяг оруулна уу!' }).min(1, 'Хаяг оруулна уу!'),
  type: zod
    .nativeEnum(DRIVER_TYPE_ENUM)
    .refine((val) => val !== undefined, { message: 'Үйлчилгээний төрөл оруулна уу!' }),
  patientFirstName: zod.string({ required_error: 'Нэр оруулна уу!' }).min(1, 'Нэр оруулна уу!'),
  patientLastName: zod.string({ required_error: 'Овог оруулна уу!' }).min(1, 'Овог оруулна уу!'),
  patientRegisterNumber: zod
    .string({ required_error: 'Регистр дугаар оруулна уу!' })
    .min(1, 'Регистр дугаар оруулна уу!'),
  patientAge: zod
    .number({ required_error: 'Өвчтөний нас оруулна уу!' })
    .min(1, 'Өвчтөний нас оруулна уу!'),
  patientPhoneNumber: zod
    .string({ required_error: 'Утасны дугаар оруулна уу!' })
    .min(8, 'Утасны дугаар багадаа 8 тэмдэгт оруулна уу!')
    .regex(/^\d+$/, 'Утасны дугаар зөвхөн тооноос бүрдэх ёстой!'),
  patientGender: zod.nativeEnum(GENDER_ENUM, {
    required_error: 'Хүйс оруулна уу!',
  }),
  level: zod.nativeEnum(LEVEL_ENUM, { required_error: 'Түвшин оруулна уу!' }),
  cityId: zod.string({ required_error: 'Хот сонгоно уу!' }).min(1, 'Хот сонгоно уу!'),
  districtId: zod
    .string({ required_error: 'Дүүрэг болон сум сонгоно уу!' })
    .min(1, 'Дүүрэг болон сум сонгоно уу!'),
  subDistrictId: zod
    .string({ required_error: 'Дүүрэг болон сумын дэлгэрэнгүй мэдээлэл!' })
    .min(1, 'Дүүрэг болон сумын дэлгэрэнгүй мэдээлэл!'),
  street: zod
    .string({ required_error: 'Дүүрэг болон сумын дэлгэрэнгүй мэдээлэл!' })
    .min(1, 'Гудам оруулна уу!'),
  no: zod.string({ required_error: 'Номер оруулна уу!' }).min(1, 'Номер оруулна уу!'),
  latitude: zod.number(),
  longitude: zod.number(),
  reason: zod.string({ required_error: 'Тайлбар оруулна уу!' }).min(1, 'Тайлбар оруулна уу!'),
});

export type AmbulanceSchemaType = zod.infer<typeof AmbulanceSchema>;
