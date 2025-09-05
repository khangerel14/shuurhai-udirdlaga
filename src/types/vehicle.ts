import type { SubUser } from './user';
import type { IDriver } from './driver';
import type { STATUS_ENUM } from './common';
import type { VehicleType } from './vehicle-type';
import type { VehicleModel } from './vehicle-model';
import type { VehicleManufacture } from './vehicle-manufacture';

export type IVehicle = {
  certificate: string;
  color: string;
  createdAt: Date;
  createdUser: SubUser;
  driver: IDriver;
  id: string;
  importDate: Date;
  licencePlate: string;
  status: STATUS_ENUM;
  updatedAt: Date;
  updatedUser: SubUser;
  user: SubUser;
  vehicleManufacture: VehicleManufacture;
  vehicleModel: VehicleModel;
  vehicleType: VehicleType;
};
