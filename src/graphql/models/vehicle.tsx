import { driverModel } from './driver';

export const vehicleModel = `
  id
  name
  status
  createdAt
  updatedAt
`;

export const vehicleType = `
  id
  name
  status
  createdAt
  updatedAt
`;

export const vehicleManufacture = `
  id
  name
  status
  createdAt
  updatedAt
`;

export const vehicle = `
  id
  vehicleType {
    ${vehicleType}
  }
  vehicleManufacture {
    ${vehicleManufacture}
  }
  vehicleModel {
    ${vehicleModel}
  }
  driver {
    ${driverModel}
  }
  licencePlate
  certificate
  color
  importDate
  status
  createdAt
  updatedAt
`;
