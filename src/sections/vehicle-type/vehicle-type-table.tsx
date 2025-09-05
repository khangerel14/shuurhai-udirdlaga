'use client';

import type { CustomFilters } from 'src/components/table/table-filter-custom';
import type { VehicleType, IVehicleTypeTableFilters } from 'src/types/vehicle-type';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { VEHICLE_TYPE_TABLE_HEAD } from 'src/utils/table-header';

import { useGetVehicleTypesQuery } from 'src/actions/vehicle-type';

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

import { DIALOG_TYPE, STATUS_FILTER, STATUS_OPTIONS } from 'src/types/common';

import { VehicleTypeTableRow } from './vehicle-type-table-row';
import { VehicleTypeCreateUpdateViewDialog } from './vehicle-type-create-dialog';

// ----------------------------------------------------------------------

export interface FiltersProps {
  name: string;
  status: STATUS_FILTER;
}

// ----------------------------------------------------------------------

export function VehicleTypeTable() {
  const table = useTable();
  const dialog = useBoolean();

  const [dialogType, setDialogType] = useState(DIALOG_TYPE.CREATE);
  const [currentRow, setCurrentRow] = useState<VehicleType | null>();

  const handleRowAction = (rowDialogType: DIALOG_TYPE, row?: VehicleType) => {
    setDialogType(rowDialogType);
    dialog.onTrue();
    if (rowDialogType === DIALOG_TYPE.CREATE) {
      setCurrentRow(null);
    } else if (row) setCurrentRow(row);
  };

  const filters = useSetState<IVehicleTypeTableFilters>({
    id: '',
    name: '',
    status: STATUS_FILTER.ALL,
    page: 1,
    rowsPerPage: 10,
    order: 'asc',
    sort: 'createdAt',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const {
    datas: vehicleTypes,
    loading,
    count,
    refetch,
  } = useGetVehicleTypesQuery({ table, currentFilters, open: true });

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
        <TableSkeleton key={index} rowCount={1} cellCount={VEHICLE_TYPE_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (vehicleTypes ?? []).map((row: VehicleType, index: number) => (
    <VehicleTypeTableRow
      key={index}
      row={row}
      refetch={refetch}
      handleRowAction={handleRowAction}
      index={table.page * table.rowsPerPage + index}
    />
  ));

  const searchFields: CustomFilters[] = [{ key: 'name', placeholder: 'Нэр', type: 'text' }];

  const hasDriverType = count !== 0;
  const tableContent = hasDriverType ? renderTable : <TableNoData notFound />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Тээврийн хэрэгсэлийн төрлийн жагсаалт"
        links={[
          { name: 'Хяналтын самбар', href: '/dashboard' },
          { name: 'Тээврийн хэрэгсэлийн төрлийн жагсаалт' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleRowAction(DIALOG_TYPE.CREATE)}
          >
            Төрөл нэмэх
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
              headCells={VEHICLE_TYPE_TABLE_HEAD}
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
      <VehicleTypeCreateUpdateViewDialog
        dialogType={dialogType}
        dialog={dialog}
        refetch={refetch}
        currentRow={currentRow}
      />
    </>
  );
}
