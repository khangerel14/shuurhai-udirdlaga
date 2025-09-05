import { DashboardContent } from 'src/layouts/dashboard';

import { DriverTable } from '../driver-table';

export function DriverListView() {
  return (
    <DashboardContent title="Жолоочийн жагсаалт">
      <DriverTable />
    </DashboardContent>
  );
}
