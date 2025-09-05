import { z as zod } from 'zod';

import { DRIVER_TYPE_ENUM } from 'src/types/common';

export const EmergencySchema = zod.object({
  callerPhoneNumber: zod
    .string({ required_error: 'Утасны дугаар оруулна уу!' })
    .min(8, 'Утасны дугаар багадаа 8 тэмдэгт оруулна уу!')
    .regex(/^\d+$/, 'Утасны дугаар зөвхөн тооноос бүрдэх ёстой!'),
  address: zod.string({ required_error: 'Хаяг оруулна уу!' }).min(1, 'Хаяг оруулна уу!'),
  type: zod.nativeEnum(DRIVER_TYPE_ENUM, { required_error: 'Үйлчилгээний төрөл оруулна уу!' }),
  callerFirstName: zod.string({ required_error: 'Овог оруулна уу!' }).min(1, 'Овог оруулна уу!'),
  callerLastName: zod.string({ required_error: 'Нэр оруулна уу!' }).min(1, 'Нэр оруулна уу!'),
  callerRegisterNumber: zod
    .string({ required_error: 'Регистр дугаар оруулна уу!' })
    .min(1, 'Регистр дугаар оруулна уу!'),
  callReasonFirstId: zod
    .string({ required_error: 'Дуудлагын эхний шалтгаан оруулна уу!' })
    .min(1, 'Дуудлагын эхний шалтгаан оруулна уу!'),
  calledDate: zod.string({ required_error: 'Дуудлагын цаг оруулна уу!' }).optional(),
  callReasonSecondId: zod
    .string({ required_error: 'Дуудлагын хоёр дахь шалтгаан оруулна уу!' })
    .min(1, 'Дуудлагын хоёр дахь шалтгаан оруулна уу!'),
  callReasonThirdId: zod
    .string({ required_error: 'Дуудлагын гурав дахь шалтгаан оруулна уу!' })
    .min(1, 'Дуудлагын гурав дахь шалтгаан оруулна уу!'),
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

export type EmergencySchemaType = zod.infer<typeof EmergencySchema>;
