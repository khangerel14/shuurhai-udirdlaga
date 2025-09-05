import type { SubUser } from './user';
import type { STATUS_ENUM, STATUS_FILTER } from './common';

export type ISubCityType = {
  id: string;
  name: string;
  status: STATUS_ENUM;
  createdAt: Date;
  updatedAt: Date;
};

export type ICityTypeTableFilters = {
  id: string;
  name: string;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type ICityType = {
  id: string;
  name: string;
  status: STATUS_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
