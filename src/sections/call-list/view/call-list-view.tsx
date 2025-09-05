import { DashboardContent } from 'src/layouts/dashboard';

import { CallTable } from '../call-table';

export function CallListView() {
  return (
    <DashboardContent title="Дуудлагын жагсаалт">
      <CallTable />
    </DashboardContent>
  );
}
