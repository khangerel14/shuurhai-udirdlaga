export enum ROLE {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  DRIVER = 'driver',
}

export enum DIALOG_TYPE {
  CREATE = 'create',
  UPDATE = 'update',
  VIEW = 'view',
  CLOSED = 'closed',
}

export enum STATUS_ENUM {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum GENDER_ENUM {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum STATUS_FILTER {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Бүгд' },
  { value: 'active', label: 'Идэвхтэй' },
  { value: 'inactive', label: 'Идэвхгүй' },
  { value: 'deleted', label: 'Устгагдсан' },
];

export enum DRIVER_TYPE_ENUM {
  EMERGENCY = 'emergency',
  POLICE = 'police',
  AMBULANCE = 'ambulance',
}

export enum DRIVER_TYPE_FILTER {
  ALL = 'all',
  EMERGENCY = 'emergency',
  POLICE = 'police',
  AMBULANCE = 'ambulance',
}

export enum LEVEL_ENUM {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
}

export enum DEVICE_STATUS_ENUM {
  ONLINE = 'online',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}
