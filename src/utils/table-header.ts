import type { TableHeadCellProps } from 'src/components/table';

export const DRIVER_TYPE_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'description', label: 'Тайлбар' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const VEHICLE_TYPE_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];
export const VEHICLE_MANUFACTURE_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const CALL_DRIVER_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'deviceId', label: 'Төхөөрөмжийн дугаар' },
  { id: 'status', label: 'Төлөв' },
  { id: 'updatedAt', label: 'Зассан огноо' },
];

export const LOCATION_CITY_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const LOCATION_DISTRICT_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'city', label: 'Хот' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const LOCATION_COMMITTEE_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'city', label: 'Хот' },
  { id: 'district', label: 'Дүүрэг' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const VEHICLE_MODEL_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'vehicleType', label: 'Төрөл' },
  { id: 'vehicleManufacture', label: 'Үйлдвэрлэгч' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const DRIVER_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'phone', label: 'Утасны дугаар' },
  { id: 'deviceId', label: 'Төхөөрөмжийн дугаар' },
  { id: 'type', label: 'Төрөл' },
  { id: 'licencePlate', label: 'Улсын дугаар' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const CALL_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'district', label: 'Дүүрэг' },
  { id: 'subDistrict', label: 'Хороо' },
  { id: 'street', label: 'Гудам' },
  { id: 'type', label: 'Төрөл' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];

export const USER_TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'no', label: '№', width: 60, align: 'center' },
  { id: 'name', label: 'Нэр' },
  { id: 'email', label: 'И-мэйл' },
  { id: 'phone', label: 'Утасны дугаар' },
  { id: 'role', label: 'Үйлчилгээ' },
  { id: 'status', label: 'Төлөв', width: 150 },
  { id: 'createdAt', label: 'Үүсгэсэн огноо', width: 180, sortable: true },
  { id: 'updatedAt', label: 'Зассан огноо', width: 160, sortable: true },
  { id: '', width: 88 },
];
