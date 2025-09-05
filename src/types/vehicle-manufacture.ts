import type { STATUS_ENUM, STATUS_FILTER } from './common';

export type IVehicleManufactureTableFilters = {
  id: string;
  name: string;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type VehicleManufacture = {
  id: string;
  name: string;
  status: STATUS_ENUM;
  createdAt: Date;
  updatedAt: Date;
};
