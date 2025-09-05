import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { useState } from 'react';

import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { useGetCitiesQuery } from 'src/actions/location-city';
import { useGetImapPointAddress } from 'src/actions/imap-tile';
import { useGetDistrictsQuery } from 'src/actions/location-district';
import { useGetCommitteesQuery } from 'src/actions/location-committee';

import { DRIVER_TYPE_ENUM } from 'src/types/common';

import { CallPoliceForm } from './call-police-form';
import { CallAmbulanceForm } from './call-ambulance-form';
import { CallEmergencyForm } from './call-emergency-form';

import type { SetLocationType } from './view';

type Props = Readonly<{
  dialog: UseBooleanReturn;
  location: SetLocationType | null;
}>;

export const CallDialog = ({ dialog, location }: Props) => {
  const [cityId, setCityId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const { address, loading: loadingAddress } = useGetImapPointAddress({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
  });
  const { datas: cities } = useGetCitiesQuery({ open: dialog.value });
  const { datas: districts } = useGetDistrictsQuery({ open: dialog.value, cityId });
  const { datas: subDistricts } = useGetCommitteesQuery({ open: dialog.value, districtId });

  const switchType = () => {
    switch (location?.type) {
      case DRIVER_TYPE_ENUM.AMBULANCE:
        return (
          <CallAmbulanceForm
            dialog={dialog}
            cities={cities}
            address={address}
            location={location}
            districts={districts}
            setCityId={setCityId}
            subDistricts={subDistricts}
            setDistrictId={setDistrictId}
            loadingAddress={loadingAddress}
          />
        );
      case DRIVER_TYPE_ENUM.EMERGENCY:
        return (
          <CallEmergencyForm
            dialog={dialog}
            cities={cities}
            address={address}
            location={location}
            districts={districts}
            setCityId={setCityId}
            subDistricts={subDistricts}
            setDistrictId={setDistrictId}
            loadingAddress={loadingAddress}
          />
        );
      case DRIVER_TYPE_ENUM.POLICE:
        return (
          <CallPoliceForm
            dialog={dialog}
            cities={cities}
            address={address}
            location={location}
            districts={districts}
            setCityId={setCityId}
            subDistricts={subDistricts}
            setDistrictId={setDistrictId}
            loadingAddress={loadingAddress}
          />
        );
      default:
        return '';
    }
  };

  return (
    <Dialog open={dialog.value} onClose={dialog.onFalse} fullWidth maxWidth="md">
      <DialogTitle>Дуудлага нэмэх</DialogTitle>
      <DialogContent>{switchType()}</DialogContent>
    </Dialog>
  );
};
