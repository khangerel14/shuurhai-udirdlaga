import type { SubUser } from './user';
import type { ISubCityType } from './location-city';
import type { IDistrictType } from './location-district';
import type { STATUS_ENUM, STATUS_FILTER } from './common';

export type ICommitteeTypeTableFilters = {
  id: string;
  name: string;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type ICommitteeType = {
  id: string;
  name: string;
  district: IDistrictType;
  city: ISubCityType;
  status: STATUS_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
