'use client';

import type { DRIVER_TYPE_ENUM } from 'src/types/common';

import { useMemo, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Stack } from '@mui/material';

import { useGetDriversQuery } from 'src/actions/driver';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDeviceUrl } from 'src/graphql/queries/device-url';

import { MapContainer } from '../map-container';
import { DeviceDetail } from '../device-details';
import { PositionDetails } from '../position-details';

export type SetLocationType = {
  type: DRIVER_TYPE_ENUM;
  longitude: number;
  latitude: number;
};

export function CallListBoardView() {
  const dialog = useBoolean();
  const [selected, setSelected] = useState<number | null>(null);
  const [location, setLocation] = useState<SetLocationType | null>(null);
  const { datas: driversData, count, loading } = useGetDriversQuery({});

  const drivers = useMemo(() => driversData ?? [], [driversData]);

  // const { positions } = useGetSocketData();
  const { devices, positions } = useGetDeviceUrl();

  const socketPositions = useMemo(() => positions ?? [], [positions]);
  const socketDevices = useMemo(() => devices ?? [], [devices]);

  const handleSetLocation = (loc: SetLocationType) => {
    setLocation(loc);
  };

  return (
    <DashboardContent title="Дуудлага">
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2} sx={{ width: '30%' }}>
          <DeviceDetail
            count={count}
            dialog={dialog}
            drivers={drivers}
            loading={loading}
            location={location}
            selected={selected}
            setSelected={setSelected}
            socketDevices={socketDevices}
            socketPositions={socketPositions}
          />
          <PositionDetails
            dialog={dialog}
            drivers={drivers}
            location={location}
            selected={selected}
            socketPositions={socketPositions}
          />
        </Stack>
        <MapContainer
          dialog={dialog}
          drivers={drivers}
          selected={selected}
          setSelected={setSelected}
          socketDevices={socketDevices}
          setLocation={handleSetLocation}
          socketPositions={socketPositions}
        />
      </Stack>
    </DashboardContent>
  );
}
