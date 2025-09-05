import type { ICityType } from 'src/types/location-city';
import type { UseBooleanReturn } from 'minimal-shared/hooks';
import type { IDistrictType } from 'src/types/location-district';
import type { ICommitteeType } from 'src/types/location-committee';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import { Card, Stack, Button, MenuItem, CardHeader } from '@mui/material';

import { formatLevel, formatGender } from 'src/utils/format-status';

import Loading from 'src/app/loading';
import { useCreateCallAmbulanceMutation } from 'src/actions/call';
import { AmbulanceSchema, type AmbulanceSchemaType } from 'src/schema/ambulance-schema';

import { Form, Field } from 'src/components/hook-form';
import { handleRequest } from 'src/components/request/handle-request';

import { LEVEL_ENUM, GENDER_ENUM, DRIVER_TYPE_ENUM } from 'src/types/common';

import type { SetLocationType } from './view';

type Props = Readonly<{
  address: string;
  cities: ICityType[];
  dialog: UseBooleanReturn;
  loadingAddress?: boolean;
  districts: IDistrictType[];
  subDistricts: ICommitteeType[];
  location: SetLocationType | null;
  setCityId: (id: string | null) => void;
  setDistrictId: (id: string | null) => void;
}>;

export const CallAmbulanceForm = ({
  cities,
  dialog,
  address,
  location,
  districts,
  setCityId,
  subDistricts,
  setDistrictId,
  loadingAddress,
}: Props) => {
  const { executeCreateCallAmbulance, loading } = useCreateCallAmbulanceMutation();
  const methods = useForm<AmbulanceSchemaType>({
    defaultValues: {
      address: address ?? '',
      type: DRIVER_TYPE_ENUM.AMBULANCE,
      callerPhoneNumber: '',
      patientFirstName: '',
      patientLastName: '',
      patientRegisterNumber: '',
      patientAge: 0,
      patientPhoneNumber: '',
      patientGender: GENDER_ENUM.MALE,
      level: LEVEL_ENUM.GREEN,
      cityId: '',
      districtId: '',
      subDistrictId: '',
      street: '',
      no: '',
      longitude: location?.longitude ?? 0,
      latitude: location?.latitude ?? 0,
      reason: '',
    },
    resolver: zodResolver(AmbulanceSchema),
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      address: address ?? '',
      longitude: location?.longitude ?? 0,
      latitude: location?.latitude ?? 0,
      type: DRIVER_TYPE_ENUM.AMBULANCE,
    });
  }, [address, reset, location]);

  const cityId = watch('cityId');
  const districtId = watch('districtId');

  useEffect(() => {
    setCityId(cityId);
    setDistrictId(districtId);
  }, [cityId, districtId, setCityId, setDistrictId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { message, success } = await executeCreateCallAmbulance({
        ...data,
      });
      if (success) {
        reset();
        dialog.onFalse();
      }
      handleRequest(message, success);
    } catch (error) {
      handleRequest('Алдаа гарлаа: ' + error, false);
    }
  });

  if (loadingAddress) return <Loading />;

  return (
    <FormProvider {...methods}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 2, py: 1.5 }}>
          <CardHeader subheader="Холбогдогчийн мэдээлэл" sx={{ mb: 2, p: 0 }} />
          <Grid container spacing={2} py={1} mb={1}>
            <Grid size={{ xs: 3 }}>
              <Field.Text name="patientFirstName" label="Холбогдогчийн нэр" size="small" />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Field.Text name="patientLastName" label="Холбогдогчийн овог" size="small" />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Field.Text name="patientRegisterNumber" label="Холбогдогчийн регистр" size="small" />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Field.NumberInput name="patientAge" label="Холбогдогчийн нас" hideButtons />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Text name="patientPhoneNumber" label="Холбогдогчийн утас" size="small" />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Select name="patientGender" label="Хүйс" size="small">
                {Object.values(GENDER_ENUM)?.map((gender) => (
                  <MenuItem value={gender} key={gender}>
                    {formatGender(gender)}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Select name="level" label="Түвшин" size="small">
                {Object.values(LEVEL_ENUM)?.map((level) => (
                  <MenuItem value={level} key={level}>
                    {formatLevel(level)}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 2, py: 1.5, my: 2 }}>
          <CardHeader subheader="Хаягийн мэдээлэл" sx={{ mb: 2, p: 0 }} />
          <Grid container spacing={2} py={1} mb={1}>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="address" label="Хаяг" size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="callerPhoneNumber" label="Дуудлага өгөгчийн утас" size="small" />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Select name="cityId" label="Хот" size="small">
                {cities?.map((city) => (
                  <MenuItem value={city.id} key={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Select name="districtId" label="Дүүрэг сум" size="small">
                {districts?.map((district) => (
                  <MenuItem value={district.id} key={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Field.Select name="subDistrictId" label="Баг хороо" size="small">
                {subDistricts?.map((subDistrict) => (
                  <MenuItem value={subDistrict.id} key={subDistrict.id}>
                    {subDistrict.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="street" label="Гудам" size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="no" label="Номер" size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="longitude" label="Уртраг" size="small" type="number" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Field.Text name="latitude" label="Өргөрөг" size="small" type="number" />
            </Grid>
          </Grid>
        </Card>
        <Field.Editor name="reason" placeholder="Шалтгаан оруулна уу!" />
        <Stack direction="row" justifyContent="flex-end" spacing={2} py={2}>
          <Button onClick={() => dialog.onFalse()}>Хаах</Button>
          <Button variant="contained" type="submit" loading={loading || isSubmitting}>
            Хадгалах
          </Button>
        </Stack>
      </Form>
    </FormProvider>
  );
};
