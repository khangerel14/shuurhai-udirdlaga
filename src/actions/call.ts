import type { ICallTableFilters } from 'src/types/call';
import type { UseTableReturn } from 'src/components/table';
import type { SetLocationType } from 'src/sections/call/view';
import type { LEVEL_ENUM, GENDER_ENUM, DRIVER_TYPE_ENUM } from 'src/types/common';

import { useQuery, useMutation } from '@apollo/client';

import { getCalls } from 'src/graphql/queries/call.';
import { getCallReasons } from 'src/graphql/queries/reason';
import {
  createCallPolice,
  createCallAmbulance,
  createCallEmergency,
} from 'src/graphql/mutations/call.mutation';

export const useCreateCallPoliceMutation = () => {
  const [createCallPoliceMutation, { loading }] = useMutation(createCallPolice);

  const executeCreateCallPolice = async (variables: {
    callerPhoneNumber: string;
    address: string;
    type: DRIVER_TYPE_ENUM;
    callerFirstName: string;
    callerLastName: string;
    callerRegisterNumber: string;
    patientFirstName: string;
    patientLastName: string;
    patientRegisterNumber: string;
    cityId: string;
    districtId: string;
    subDistrictId: string;
    street: string;
    no: string;
    latitude: SetLocationType['longitude'];
    longitude: SetLocationType['latitude'];
    reason: string;
  }): Promise<{ message: string; success: boolean }> => {
    try {
      const { data } = await createCallPoliceMutation({
        variables,
      });

      const { create_call_police } = data ?? {};
      const { message, success } = create_call_police ?? {};

      return { message, success };
    } catch (error) {
      console.error('Error creating call police:', error);
      throw error;
    }
  };

  return { executeCreateCallPolice, loading };
};

export const useCreateCallAmbulanceMutation = () => {
  const [createCallAmbulanceMutation, { loading }] = useMutation(createCallAmbulance);

  const executeCreateCallAmbulance = async (variables: {
    address: string;
    type: DRIVER_TYPE_ENUM;
    callerPhoneNumber: string;
    patientFirstName: string;
    patientLastName: string;
    patientRegisterNumber: string;
    patientAge: number;
    patientPhoneNumber: string;
    patientGender: GENDER_ENUM;
    level: LEVEL_ENUM;
    cityId: string;
    districtId: string;
    subDistrictId: string;
    street: string;
    no: string;
    longitude: SetLocationType['longitude'];
    latitude: SetLocationType['latitude'];
    reason: string;
  }): Promise<{ message: string; success: boolean }> => {
    try {
      const { data } = await createCallAmbulanceMutation({
        variables,
      });

      const { create_call_ambulance } = data ?? {};
      const { message, success } = create_call_ambulance ?? {};

      return { message, success };
    } catch (error) {
      console.error('Error creating call police:', error);
      throw error;
    }
  };

  return { executeCreateCallAmbulance, loading };
};

export const useCreateCallEmergencyMutation = () => {
  const [createCallEmergencyMutation, { loading }] = useMutation(createCallEmergency);

  const executeCreateCallEmergency = async (variables: {
    address: string;
    callerPhoneNumber: string;
    type: DRIVER_TYPE_ENUM;
    callerFirstName: string;
    callerLastName: string;
    callerRegisterNumber: string;
    cityId: string;
    districtId: string;
    subDistrictId: string;
    street: string;
    no: string;
    latitude: SetLocationType['longitude'];
    longitude: SetLocationType['latitude'];
    reason: string;
    calledDate?: string;
    callReasonFirstId: string;
    callReasonSecondId: string;
    callReasonThirdId: string;
  }): Promise<{ message: string; success: boolean }> => {
    try {
      const { data } = await createCallEmergencyMutation({
        variables,
      });

      const { create_call_emergency } = data ?? {};
      const { message, success } = create_call_emergency ?? {};

      return { message, success };
    } catch (error) {
      console.error('Error creating call police:', error);
      throw error;
    }
  };

  return { executeCreateCallEmergency, loading };
};

export const useGetCallReasonsFirstQuery = () => {
  const { data, loading } = useQuery(getCallReasons);

  const { get_call_reasons } = data ?? {};
  const { datas: first } = get_call_reasons ?? {};

  return { first, loading };
};

export const useGetCallReasonsSecondQuery = ({ secondId }: { secondId?: string }) => {
  const { data, loading } = useQuery(getCallReasons, {
    variables: {
      parentId: secondId,
    },
  });

  const { get_call_reasons } = data ?? {};
  const { datas: second } = get_call_reasons ?? {};

  return { second, loading };
};

export const useGetCallReasonsThirdQuery = ({ thirdId }: { thirdId?: string }) => {
  const { data, loading } = useQuery(getCallReasons, {
    variables: {
      parentId: thirdId,
    },
  });

  const { get_call_reasons } = data ?? {};
  const { datas: third } = get_call_reasons ?? {};

  return { third, loading };
};

export const useGetCallsQuery = ({
  currentFilters,
  table,
}: {
  currentFilters: ICallTableFilters;
  table: UseTableReturn;
}) => {
  const { data, loading } = useQuery(getCalls, {
    variables: {
      ...currentFilters,
      page: table.page + 1,
      limit: table.rowsPerPage,
      order: table.orderBy,
      sort: table.order,
    },
  });

  const { get_calls } = data ?? {};
  const { datas, count } = get_calls ?? {};

  return { datas, loading, count };
};
