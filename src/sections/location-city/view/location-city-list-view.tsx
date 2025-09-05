import { DashboardContent } from 'src/layouts/dashboard';

import { LocationCityTable } from '../location-city-table';

export function LocationCityListView() {
  return (
    <DashboardContent title="Хотуудын жагсаалт">
      <LocationCityTable />
    </DashboardContent>
  );
}
