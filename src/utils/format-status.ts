import type { IDriver } from 'src/types/driver';
import type { ISocketDevice, ISocketPosition } from 'src/types/socket';

import {
  ROLE,
  LEVEL_ENUM,
  DIALOG_TYPE,
  STATUS_ENUM,
  GENDER_ENUM,
  DRIVER_TYPE_ENUM,
  DEVICE_STATUS_ENUM,
  DRIVER_TYPE_FILTER,
} from 'src/types/common';

import type { I3DMarkerData } from './map';

export function formatUser(user: ROLE) {
  if (user === ROLE.ADMIN) return 'Админ';
  if (user === ROLE.DRIVER) return 'Жолооч';
  if (user === ROLE.OPERATOR) return 'Оператор';
  return user;
}

export function formatGender(user: GENDER_ENUM) {
  if (user === GENDER_ENUM.FEMALE) return 'Эмэгтэй';
  if (user === GENDER_ENUM.MALE) return 'Эрэгтэй';
  if (user === GENDER_ENUM.OTHER) return 'Бусад';
  return user;
}

export function formatDriverType(type: DRIVER_TYPE_ENUM) {
  if (type === DRIVER_TYPE_ENUM.AMBULANCE) return 'Эмнэлгийн машин';
  if (type === DRIVER_TYPE_ENUM.EMERGENCY) return 'Галын машин';
  if (type === DRIVER_TYPE_ENUM.POLICE) return 'Цагдаагийн машин';
  return type;
}

export function formatDriverTypeFilter(type: DRIVER_TYPE_FILTER) {
  if (type === DRIVER_TYPE_FILTER.ALL) return 'Бүгд';
  if (type === DRIVER_TYPE_FILTER.AMBULANCE) return 'Эмнэлгийн машин';
  if (type === DRIVER_TYPE_FILTER.EMERGENCY) return 'Галын машин';
  if (type === DRIVER_TYPE_FILTER.POLICE) return 'Цагдаагийн машин';
  return type;
}

export function formatLevel(level: LEVEL_ENUM) {
  if (level === LEVEL_ENUM.GREEN) return 'Хөнгөн түвшин';
  if (level === LEVEL_ENUM.YELLOW) return 'Дунд түвшин';
  if (level === LEVEL_ENUM.RED) return 'Хүнд түвшин';
  return level;
}

export function formatStatus(status: STATUS_ENUM) {
  if (status === STATUS_ENUM.ACTIVE)
    return { text: 'Идэвхитэй', color: 'success', icon: 'solar:check-circle-line-duotone' };
  if (status === STATUS_ENUM.INACTIVE)
    return { text: 'Идэвхгүй', color: 'warning', icon: 'mynaui:panel-left-inactive' };
  if (status === STATUS_ENUM.DELETED)
    return { text: 'Устгагдсан', color: 'error', icon: 'solar:trash-bin-trash-outline' };
  return status;
}

export function formatDeviceStatus(status: DEVICE_STATUS_ENUM) {
  if (status === DEVICE_STATUS_ENUM.OFFLINE) return 'OFFLINE';
  if (status === DEVICE_STATUS_ENUM.ONLINE) return 'ONLINE';
  if (status === DEVICE_STATUS_ENUM.UNKNOWN) return 'UNKNOWN';
  return status;
}

export const dialogTypeName = (dialogType: DIALOG_TYPE, value?: string) => {
  switch (dialogType) {
    case DIALOG_TYPE.CREATE:
      return `${value} нэмэх`;
    case DIALOG_TYPE.VIEW:
      return 'Мэдээлэл харах';
    case DIALOG_TYPE.UPDATE:
      return 'Мэдээлэл засварлах';
    default:
      return '';
  }
};

export const getVehicle3DMarkerData = (
  socketPosition: ISocketPosition,
  drivers: IDriver[],
  socketDevices: ISocketDevice[]
): I3DMarkerData => {
  const driver = drivers?.find(
    (driverUnit: IDriver) => driverUnit?.traccarDevice?.id === socketPosition?.deviceId
  );

  console.log(driver);

  const socketDevice = socketDevices?.find((device) => device?.id === socketPosition?.deviceId);

  const modelData: I3DMarkerData = (() => {
    switch (driver?.type) {
      case DRIVER_TYPE_ENUM.AMBULANCE:
        return {
          modelUrl: '/assets/models/ambulance.glb',
          scale: 0.5,
          socketPosition,
          socketDevice,
          driver,
        };
      case DRIVER_TYPE_ENUM.EMERGENCY:
        return {
          modelUrl: '/assets/models/emergency.glb',
          scale: 0.6,
          socketPosition,
          socketDevice,
          driver,
        };
      case DRIVER_TYPE_ENUM.POLICE:
        return {
          modelUrl: '/assets/models/police.glb',
          scale: 0.6,
          socketPosition,
          socketDevice,
          driver,
        };
      default:
        return {
          modelUrl: '/assets/models/truck.glb',
          scale: 0.3,
          socketPosition: undefined,
          socketDevice: undefined,
          driver: undefined,
        };
    }
  })();
  return modelData;
};
