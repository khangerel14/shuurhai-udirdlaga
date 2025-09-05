import type { IDriver } from 'src/types/driver';
import type { ISocketPosition } from 'src/types/socket';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

import dayjs from 'dayjs';

import { Card, Stack, CardHeader, Typography, CardContent } from '@mui/material';

import { CallDialog } from './call-dialog';

import type { SetLocationType } from './view/call-list-board-view';

type Props = Readonly<{
  drivers: IDriver[];
  selected: number | null;
  dialog: UseBooleanReturn;
  location: SetLocationType | null;
  socketPositions: ISocketPosition[];
}>;

export const PositionDetails = ({ selected, location, dialog, socketPositions }: Props) => (
  <>
    <Card>
      <CardHeader title="Тээврийн хэрэгслийн хяналтын самбар" sx={{ p: 2 }} />
      <CardContent>
        {socketPositions?.length > 0 &&
          selected !== null &&
          socketPositions
            ?.filter((pos) => pos.id === selected)
            .map((row: ISocketPosition) => (
              <Stack key={row.id} spacing={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Time</Typography>
                  <Typography>{dayjs(row.deviceId).format('YYYY-MM-DD')}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Өргөрөг</Typography>
                  <Typography>{row?.latitude}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Уртраг</Typography>
                  <Typography>{row?.longitude}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Valid</Typography>
                  <Typography>{row?.valid === true ? 'Тийм' : 'Үгүй'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Accuracy</Typography>
                  <Typography>{row.accuracy}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Өндөр</Typography>
                  <Typography>{row?.altitude}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Хурд</Typography>
                  <Typography>{row?.speed} зангилаа</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Course</Typography>
                  <Typography>{row?.attributes?.course}°</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Хаяг</Typography>
                  <Typography textAlign="end">{row?.address}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Протокол</Typography>
                  <Typography>{row.protocol}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Course</Typography>
                  <Typography>Course</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Battery Level</Typography>
                  <Typography>{row?.attributes?.batteryLevel} %</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Event</Typography>
                  <Typography>{row?.attributes?.event}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Ignition</Typography>
                  <Typography>{row?.attributes?.ignition === true ? 'Тийм' : 'Үгүй'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Motion</Typography>
                  <Typography>{row?.attributes?.motion === true ? 'Тийм' : 'Үгүй'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Distance</Typography>
                  <Typography>{row?.attributes?.distance} км</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography>Total Distance</Typography>
                  <Typography>{row?.attributes?.totalDistance} км</Typography>
                </Stack>
              </Stack>
            ))}
      </CardContent>
    </Card>
    <CallDialog dialog={dialog} location={location} />
  </>
);
