'use client';

import type { VehicleType } from 'src/types/vehicle-type';
import type { VehicleManufacture } from 'src/types/vehicle-manufacture';
import type { CustomFilters } from 'src/components/table/table-filter-custom';
import type { VehicleModel, IVehicleModelTableFilters } from 'src/types/vehicle-model';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { VEHICLE_MODEL_TABLE_HEAD } from 'src/utils/table-header';

import { useGetVehicleTypesQuery } from 'src/actions/vehicle-type';
import { useGetVehicleModelsQuery } from 'src/actions/vehicle-model';
import { useGetManufacturesQuery } from 'src/actions/vehicle-manufacture';

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

import { VehicleModelTableRow } from './vehicle-model-table-row';
import { VehicleModelCreateUpdateViewDialog } from './vehicle-model-create-update-dialog';

// ----------------------------------------------------------------------

export interface FiltersProps {
  name: string;
  status: STATUS_FILTER;
}

// ----------------------------------------------------------------------

export function VehicleModelTable() {
  const table = useTable();
  const dialog = useBoolean();

  const [dialogType, setDialogType] = useState(DIALOG_TYPE.CREATE);
  const [currentRow, setCurrentRow] = useState<VehicleModel | null>();

  const handleRowAction = (rowDialogType: DIALOG_TYPE, row?: VehicleModel) => {
    setDialogType(rowDialogType);
    dialog.onTrue();
    if (rowDialogType === DIALOG_TYPE.CREATE) {
      setCurrentRow(null);
    } else if (row) setCurrentRow(row);
  };

  const filters = useSetState<IVehicleModelTableFilters>({
    id: '',
    name: '',
    vehicleTypeId: null,
    vehicleManufactureId: null,
    status: STATUS_FILTER.ALL,
    page: 1,
    rowsPerPage: 10,
    order: 'asc',
    sort: 'createdAt',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const {
    datas: vehicleModels,
    loading,
    count,
    refetch,
  } = useGetVehicleModelsQuery({ table, currentFilters, open: true });

  const { datas: vehicleTypes } = useGetVehicleTypesQuery({ open: true });
  const { datas: vehicleManufactures } = useGetManufacturesQuery({ open: true });

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
        <TableSkeleton key={index} rowCount={1} cellCount={VEHICLE_MODEL_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (vehicleModels ?? []).map((row: VehicleModel, index: number) => (
    <VehicleModelTableRow
      key={index}
      row={row}
      refetch={refetch}
      handleRowAction={handleRowAction}
      index={table.page * table.rowsPerPage + index}
    />
  ));

  const searchFields: CustomFilters[] = [
    { key: 'name', placeholder: 'Нэр', type: 'text' },
    {
      key: 'vehicleTypeId',
      placeholder: 'Төрөл',
      type: 'select',
      options: (vehicleTypes ?? []).map((item: VehicleType) => ({
        label: item.name,
        value: item.id,
      })),
    },
    {
      key: 'vehicleManufactureId',
      placeholder: 'Төрөл',
      type: 'select',
      options: (vehicleManufactures ?? []).map((item: VehicleManufacture) => ({
        label: item.name,
        value: item.id,
      })),
    },
  ];

  const hasDriverType = count !== 0;
  const tableContent = hasDriverType ? renderTable : <TableNoData notFound />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Тээврийн хэрэгсэлийн моделийн жагсаалт"
        links={[
          { name: 'Хяналтын самбар', href: '/dashboard' },
          { name: 'Тээврийн хэрэгсэлийн моделийн жагсаалт' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleRowAction(DIALOG_TYPE.CREATE)}
          >
            Модел нэмэх
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
              headCells={VEHICLE_MODEL_TABLE_HEAD}
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
      <VehicleModelCreateUpdateViewDialog
        dialogType={dialogType}
        dialog={dialog}
        refetch={refetch}
        currentRow={currentRow}
      />
    </>
  );
}
