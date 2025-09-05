'use client';

import type { IDriver, IDriverTableFilters } from 'src/types/driver';
import type { CustomFilters } from 'src/components/table/table-filter-custom';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { DRIVER_TABLE_HEAD } from 'src/utils/table-header';
import { formatDriverType } from 'src/utils/format-status';

import { useGetDriversQuery } from 'src/actions/driver';

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

import { DIALOG_TYPE, STATUS_FILTER, STATUS_OPTIONS, DRIVER_TYPE_ENUM } from 'src/types/common';

import { DriverTableRow } from './driver-table-row';
import { DriverCreateViewDialog } from './driver-create-view-dialog';

// ----------------------------------------------------------------------

export interface FiltersProps {
  firstName: string;
  status: STATUS_FILTER;
}

// ----------------------------------------------------------------------

export function DriverTable() {
  const table = useTable();

  const dialog = useBoolean();

  const [dialogType, setDialogType] = useState(DIALOG_TYPE.CREATE);
  const [currentRow, setCurrentRow] = useState<IDriver | null>(null);

  const handleRowAction = (rowDialogType: DIALOG_TYPE, row?: IDriver) => {
    setDialogType(rowDialogType);
    dialog.onTrue();
    if (rowDialogType === DIALOG_TYPE.CREATE) {
      setCurrentRow(null);
    } else if (row) setCurrentRow(row);
  };

  const filters = useSetState<IDriverTableFilters>({
    id: '',
    firstName: '',
    status: STATUS_FILTER.ALL,
    deviceId: '',
    user_id: '',
    isOnline: 'all',
    type: null,
    page: 1,
    rowsPerPage: 10,
    order: 'asc',
    sort: 'createdAt',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const { datas: drivers, loading, count, refetch } = useGetDriversQuery({ table, currentFilters });

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
        <TableSkeleton key={index} rowCount={1} cellCount={DRIVER_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (drivers ?? []).map((row: IDriver, index: number) => (
    <DriverTableRow
      key={index}
      row={row}
      refetch={refetch}
      handleRowAction={handleRowAction}
      index={table.page * table.rowsPerPage + index}
    />
  ));

  const searchFields: CustomFilters[] = [
    { key: 'firstName', placeholder: 'Нэр', type: 'text' },
    {
      key: 'isOnline',
      placeholder: 'Онлайн эсэх',
      type: 'select',
      options: [
        { value: 'all', label: 'Бүгд' },
        { value: 'true', label: 'Онлайн' },
        { value: 'false', label: 'Оффлайн' },
      ],
    },
    {
      key: 'type',
      placeholder: 'Төрөл',
      type: 'select',
      options: Object.values(DRIVER_TYPE_ENUM ?? []).map((driverType: DRIVER_TYPE_ENUM) => ({
        value: driverType,
        label: formatDriverType(driverType),
      })),
    },
  ];

  const hasDriver = count !== 0;
  const tableContent = hasDriver ? renderTable : <TableNoData notFound />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Жолоочийн жагсаалт"
        links={[{ name: 'Хяналтын самбар', href: '/dashboard' }, { name: 'Жолоочийн жагсаалт' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleRowAction(DIALOG_TYPE.CREATE)}
          >
            Жолооч нэмэх
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
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              rowCount={count}
              order={table.order}
              onSort={table.onSort}
              headCells={DRIVER_TABLE_HEAD}
              orderBy={table.orderBy}
              numSelected={table.selected.length}
            />
            <TableBody>{loading ? renderSkeleton : tableContent}</TableBody>
          </Table>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={count ?? 0}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Scrollbar>
      </Card>
      <DriverCreateViewDialog
        dialogType={dialogType}
        dialog={dialog}
        refetch={refetch}
        currentRow={currentRow}
      />
    </>
  );
}
