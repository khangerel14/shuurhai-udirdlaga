import type { SubUser } from './user';
import type { ISubCityType } from './location-city';
import type { ISubDistrictType } from './location-district';
import type { ICallReason, IParentReason } from './call-reason';
import type {
  GENDER_ENUM,
  STATUS_ENUM,
  STATUS_FILTER,
  DRIVER_TYPE_ENUM,
  DRIVER_TYPE_FILTER,
} from './common';

export type ICallTableFilters = {
  city_id: string;
  district_id: string;
  sub_district_id: string;
  type: DRIVER_TYPE_FILTER;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export type ICall = {
  id: string;
  type: DRIVER_TYPE_ENUM;
  reason: string;
  city: ISubCityType;
  district: ISubDistrictType;
  subDistrict: ISubDistrictType;
  street: string;
  no: string;
  address: string;
  latitude: number;
  longitude: number;
  callerFirstName: string;
  callerLastName: string;
  callerRegisterNumber: string;
  callerPhoneNumber: string;
  calledDate: Date;
  patientFirstName: null;
  patientLastName: null;
  patientRegisterNumber: null;
  patientPhoneNumber: null;
  patientAge: null;
  patientGender: GENDER_ENUM;
  level: null;
  status: STATUS_ENUM;
  callReasonFirst: ICallReason;
  callReasonSecond: IParentReason;
  callReasonThird: IParentReason;
  isTransport: boolean;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
