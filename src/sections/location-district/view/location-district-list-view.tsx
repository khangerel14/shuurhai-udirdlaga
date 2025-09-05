import { DashboardContent } from 'src/layouts/dashboard';

import { LocationDistrictTable } from '../location-district-table';

export function LocationDistrictListView() {
  return (
    <DashboardContent title="Дүүргүүдийн жагсаалт">
      <LocationDistrictTable />
    </DashboardContent>
  );
}
