'use client';

import type { IUsers, IUserTableFilters } from 'src/types/user';
import type { CustomFilters } from 'src/components/table/table-filter-custom';

import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { formatUser } from 'src/utils/format-status';
import { USER_TABLE_HEAD } from 'src/utils/table-header';

import { useGetUsersQuery } from 'src/actions/user';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomTableFilters } from 'src/components/table/table-filter-custom';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ROLE, DIALOG_TYPE, STATUS_FILTER, STATUS_OPTIONS } from 'src/types/common';

import { UserTableRow } from './user-table-row';
import { UserCreateDialog } from './user-create-dialog';

// ----------------------------------------------------------------------

export interface FiltersProps {
  name: string;
  status: STATUS_FILTER;
}

// ----------------------------------------------------------------------

export function UserTable() {
  const table = useTable();
  const dialog = useBoolean();

  const filters = useSetState<IUserTableFilters>({
    email: '',
    phoneNumber: '',
    role: null,
    status: STATUS_FILTER.ALL,
    page: 1,
    rowsPerPage: 10,
    order: 'asc',
    sort: 'createdAt',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const { users, loading, count, refetch } = useGetUsersQuery({ table, currentFilters });

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: STATUS_FILTER) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderSkeleton = (
    <>
      {[...Array(table.rowsPerPage)].map((_, index) => (
        <TableSkeleton key={index} rowCount={1} cellCount={USER_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (users ?? []).map((row: IUsers, index: number) => (
    <UserTableRow
      key={index}
      row={row}
      refetch={refetch}
      index={table.page * table.rowsPerPage + index}
    />
  ));

  const searchFields: CustomFilters[] = [
    { key: 'email', placeholder: 'И-мэйл', type: 'text' },
    { key: 'phoneNumber', placeholder: 'Утасны дугаар', type: 'text' },
    {
      key: 'role',
      placeholder: 'Үйлчилгээ',
      type: 'select',
      options:
        Object.values(ROLE)?.map((role: ROLE) => ({
          value: role,
          label: formatUser(role),
        })) || [],
    },
  ];

  const hasDriverType = count !== 0;
  const tableContent = hasDriverType ? renderTable : <TableNoData notFound />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Хэрэглэгчдийн жагсаалт"
        links={[
          { name: 'Хяналтын самбар', href: '/dashboard' },
          { name: 'Хэрэглэгчдийн жагсаалт' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => dialog.onTrue()}
          >
            Хэрэглэгч нэмэх
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <CustomTableFilters
          onResetPage={table.onResetPage}
          filters={filters}
          fields={searchFields}
          totalResults={count}
        />
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              rowCount={count}
              order={table.order}
              onSort={table.onSort}
              headCells={USER_TABLE_HEAD}
              orderBy={table.orderBy}
              numSelected={table.selected.length}
            />
            <TableBody>{loading ? renderSkeleton : tableContent}</TableBody>
          </Table>
          <TablePaginationCustom
            page={table.page}
            count={count ?? 0}
            dense={table.dense}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Scrollbar>
      </Card>
      <UserCreateDialog dialogType={DIALOG_TYPE.CREATE} dialog={dialog} refetch={refetch} />
    </>
  );
}
