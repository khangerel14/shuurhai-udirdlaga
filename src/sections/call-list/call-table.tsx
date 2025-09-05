'use client';

import type { ICityType } from 'src/types/location-city';
import type { ICall, ICallTableFilters } from 'src/types/call';
import type { IDistrictType } from 'src/types/location-district';
import type { ICommitteeType } from 'src/types/location-committee';
import type { CustomFilters } from 'src/components/table/table-filter-custom';

import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { CALL_TABLE_HEAD } from 'src/utils/table-header';
import { formatDriverTypeFilter } from 'src/utils/format-status';

import { useGetCallsQuery } from 'src/actions/call';
import { useGetCitiesQuery } from 'src/actions/location-city';
import { useGetDistrictsQuery } from 'src/actions/location-district';
import { useGetCommitteesQuery } from 'src/actions/location-committee';

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

import { STATUS_FILTER, STATUS_OPTIONS, DRIVER_TYPE_FILTER } from 'src/types/common';

import { CallTableRow } from './call-table-row';

// ----------------------------------------------------------------------

export interface FiltersProps {
  firstName: string;
  status: STATUS_FILTER;
}

// ----------------------------------------------------------------------

export function CallTable() {
  const table = useTable();

  const filters = useSetState<ICallTableFilters>({
    city_id: '',
    district_id: '',
    sub_district_id: '',
    status: STATUS_FILTER.ALL,
    type: DRIVER_TYPE_FILTER.ALL,
    page: 1,
    rowsPerPage: 10,
    order: 'asc',
    sort: 'createdAt',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const { datas: cities } = useGetCitiesQuery({ open: true });
  const { datas: districts } = useGetDistrictsQuery({ open: true, cityId: currentFilters.city_id });
  const { datas: subDistricts } = useGetCommitteesQuery({
    open: true,
    districtId: currentFilters.district_id,
  });
  const { datas: calls, loading, count } = useGetCallsQuery({ currentFilters, table });

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
        <TableSkeleton key={index} rowCount={1} cellCount={CALL_TABLE_HEAD.length} />
      ))}
    </>
  );

  const renderTable = (calls ?? []).map((row: ICall, index: number) => (
    <CallTableRow key={index} row={row} index={table.page * table.rowsPerPage + index} />
  ));

  const searchFields: CustomFilters[] = [
    {
      key: 'type',
      placeholder: 'Төрөл',
      type: 'select',
      options: Object.values(DRIVER_TYPE_FILTER ?? []).map((driverType: DRIVER_TYPE_FILTER) => ({
        value: driverType,
        label: formatDriverTypeFilter(driverType),
      })),
    },
    {
      key: 'city_id',
      placeholder: 'Хот',
      type: 'select',
      options:
        cities?.map((city: ICityType) => ({
          value: city.id,
          label: city.name,
        })) ?? [],
    },
    {
      key: 'district_id',
      placeholder: 'Дүүрэг',
      type: 'select',
      options:
        districts?.map((district: IDistrictType) => ({
          value: district.id,
          label: district.name,
        })) ?? [],
    },
    {
      key: 'sub_district_id',
      placeholder: 'Хороо',
      type: 'select',
      options:
        subDistricts?.map((subDistrict: ICommitteeType) => ({
          value: subDistrict.id,
          label: subDistrict.name,
        })) ?? [],
    },
  ];

  const hasDriver = count !== 0;
  const tableContent = hasDriver ? renderTable : <TableNoData notFound />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Дуудлагын жагсаалт"
        links={[{ name: 'Хяналтын самбар', href: '/dashboard' }, { name: 'Дуудлагын жагсаалт' }]}
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
              headCells={CALL_TABLE_HEAD}
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
    </>
  );
}
