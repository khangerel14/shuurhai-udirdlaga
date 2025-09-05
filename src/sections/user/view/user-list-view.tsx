'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { UserTable } from '../user-table';

export function UserListView() {
  return (
    <DashboardContent title="Хэрэглэгчдийн жагсаалт">
      <UserTable />
    </DashboardContent>
  );
}
