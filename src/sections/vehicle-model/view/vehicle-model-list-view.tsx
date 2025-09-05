import { DashboardContent } from 'src/layouts/dashboard';

import { VehicleModelTable } from '../vehicle-model-table';

export function VehicleModelListView() {
  return (
    <DashboardContent title="Тээврийн хэрэгсэлийн моделийн жагсаалт">
      <VehicleModelTable />
    </DashboardContent>
  );
}
