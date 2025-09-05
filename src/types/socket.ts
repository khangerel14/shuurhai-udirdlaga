import type { DEVICE_STATUS_ENUM } from './common';

export type ISocketPosition = {
  id: number;
  attributes: {
    course: number;
    batteryLevel: number;
    event: string;
    ignition: boolean;
    motion: boolean;
    distance: number;
    totalDistance: number;
  };
  deviceId: number;
  type: null;
  protocol: string;
  deviceTime: Date;
  serverTime: Date;
  fixTime: Date;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address: string;
  accuracy: number;
  network: boolean;
};

export type ISocketDevice = {
  id: number;
  attributes: {};
  groupId: number;
  name: string;
  uniqueId: string;
  status: DEVICE_STATUS_ENUM;
  lastUpdate: string;
  positionId: number;
  geofenceIds: [];
  phone: string;
  model: string;
  contact: string;
  category: string;
  disabled: boolean;
};
