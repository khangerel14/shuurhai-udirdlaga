import type { SubUser } from './user';
import type { IVehicle } from './vehicle';
import type { ITraccarDevice } from './traccar';
import type { STATUS_ENUM, STATUS_FILTER, DRIVER_TYPE_ENUM } from './common';

export type IDriverTableFilters = {
  id: string;
  deviceId: string;
  user_id: string;
  isOnline: boolean | string;
  firstName: string;
  type: string | null;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type IDriver = {
  id: string;
  createdAt: Date;
  createdUser: SubUser;
  deviceId: string;
  isOnline: boolean;
  lastOnlineDate: Date;
  lastUpdate: Date;
  latitude: number;
  longitude: number;
  status: STATUS_ENUM;
  tripCount: number;
  type: DRIVER_TYPE_ENUM;
  traccar_device_id: string;
  traccarDevice: ITraccarDevice;
  updatedAt: Date;
  updatedUser: SubUser;
  user: SubUser;
  vehicle: IVehicle;
  device_id: string;
};
