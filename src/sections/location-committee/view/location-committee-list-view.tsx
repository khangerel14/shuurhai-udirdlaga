import { DashboardContent } from 'src/layouts/dashboard';

import { LocationCommitteeTable } from '../location-committee-table';

export function LocationCommitteeListView() {
  return (
    <DashboardContent title="Баг хорооны жагсаалт">
      <LocationCommitteeTable />
    </DashboardContent>
  );
}
