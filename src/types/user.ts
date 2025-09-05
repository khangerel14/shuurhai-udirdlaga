import type { ROLE, GENDER_ENUM, STATUS_ENUM, STATUS_FILTER } from './common';

export type IUserTableFilters = {
  email: string;
  phoneNumber: string;
  role: ROLE | null;
  status: STATUS_FILTER;
  page: number;
  rowsPerPage: number;
  order: string;
  sort: string;
};

export type SubUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  avatar: string;
  birthday: string;
  status: STATUS_ENUM;
  role: ROLE;
  gender: GENDER_ENUM;
  createdAt: Date;
  updatedAt: Date;
};

export type IUsers = {
  id: string;
  user: SubUser;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  avatar: string;
  birthday: string;
  status: STATUS_ENUM;
  role: ROLE;
  gender: GENDER_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
