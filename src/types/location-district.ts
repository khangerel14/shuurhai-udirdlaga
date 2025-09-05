import type { SubUser } from './user';
import type { ISubCityType } from './location-city';
import type { STATUS_ENUM, STATUS_FILTER } from './common';

export type ISubDistrictType = {
  id: string;
  name: string;
  status: STATUS_ENUM;
  createdAt: Date;
  updatedAt: Date;
};

export type IDistrictTypeTableFilters = {
  id: string;
  name: string;
  city_id: string;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type IDistrictType = {
  id: string;
  name: string;
  city: ISubCityType;
  status: STATUS_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
