import { DashboardContent } from 'src/layouts/dashboard';

import { VehicleManufactureTable } from '../vehicle-manufacture-table';

export function VehicleManufactureListView() {
  return (
    <DashboardContent title="Тээврийн хэрэгсэлийн үйлдвэрийн жагсаалт">
      <VehicleManufactureTable />
    </DashboardContent>
  );
}
