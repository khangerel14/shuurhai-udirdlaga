export type ITraccarDevice = {
  id: number;
  attributes: string;
  category: string;
  contact: string;
  description: string;
  groupid: number;
  lastupdate: Date;
  model: string;
  name: string;
  phone: string;
  position: TraccarPosition;
  positionid: number;
  uniqueid: string;
};

export type TraccarPosition = {
  accuracy: number;
  address: string;
  altitude: number;
  attributes: string;
  course: number;
  deviceid: number;
  devicetime: Date;
  fixtime: Date;
  id: number;
  latitude: number;
  longitude: number;
  network: string;
  protocol: string;
  servertime: Date;
  speed: number;
};
