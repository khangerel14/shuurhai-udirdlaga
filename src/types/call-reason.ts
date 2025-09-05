import type { SubUser } from './user';
import type { STATUS_ENUM } from './common';

export type IParentReason = {
  id: string;
  name: string;
  type: string;
  status: STATUS_ENUM;
  createdAt: Date;
  updatedAt: Date;
};

export type ICallReason = {
  id: string;
  name: string;
  type: string;
  parentReason: IParentReason;
  status: STATUS_ENUM;
  createdUser: SubUser;
  updatedUser: SubUser;
  createdAt: Date;
  updatedAt: Date;
};
