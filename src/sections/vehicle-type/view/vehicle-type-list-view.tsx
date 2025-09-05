import { DashboardContent } from 'src/layouts/dashboard';

import { VehicleTypeTable } from '../vehicle-type-table';

export function VehicleTypeListView() {
  return (
    <DashboardContent title="Тээврийн хэрэгсэлийн төрлийн жагсаалт">
      <VehicleTypeTable />
    </DashboardContent>
  );
}
