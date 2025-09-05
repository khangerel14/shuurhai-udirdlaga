import type { SubUser } from './user';
import type { VehicleType } from './vehicle-type';
import type { STATUS_ENUM, STATUS_FILTER } from './common';
import type { VehicleManufacture } from './vehicle-manufacture';

export type IVehicleModelTableFilters = {
  id: string;
  name: string;
  vehicleTypeId: string | null;
  vehicleManufactureId: string | null;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type VehicleModel = {
  id: string;
  name: string;
  vehicleType: VehicleType;
  vehicleManufacture: VehicleManufacture;
  status: STATUS_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
