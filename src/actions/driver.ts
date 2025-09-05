import type { GENDER_ENUM } from 'src/types/common';
import type { UseTableReturn } from 'src/components/table';
import type { IDriver, IDriverTableFilters } from 'src/types/driver';

import { useQuery, useMutation } from '@apollo/client';

import { getDriversQuery } from 'src/graphql/queries/driver.query';
import {
  changeStatusDriver,
  updateUserMutation,
  createDriverMutation,
  updateDriverMutation,
  createVehicleMutation,
  updateVehicleMutation,
} from 'src/graphql/mutations';

import { handleRequest } from 'src/components/request/handle-request';

export function useDriverMutation() {
  const [driverMutation, { loading }] = useMutation(createDriverMutation);

  const executeDriverMutation = async ({
    firstName,
    lastName,
    phoneNumber,
    password,
    avatar,
    driverData,
    deviceId,
  }: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password?: string;
    avatar: string | null;
    driverData?: { type?: string };
    deviceId: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await driverMutation({
        variables: {
          firstName,
          lastName,
          phoneNumber,
          password,
          deviceId,
          driverData: { type: driverData?.type },
          ...(avatar === null ? {} : { avatar }),
        },
      });

      const { create_driver } = data ?? {};
      const { success, message } = create_driver ?? {};

      return { success, message };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeDriverMutation, loading };
}

export function useDriverUpdateMutation() {
  const [driverUpdateMutation, { loading }] = useMutation(updateUserMutation);

  const executeUpdateDriverMutation = async ({
    updateUserId,
    firstName,
    lastName,
    phoneNumber,
    avatar,
    gender,
  }: {
    updateUserId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar: string | null;
    gender: GENDER_ENUM;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await driverUpdateMutation({
        variables: {
          updateUserId,
          firstName,
          lastName,
          phoneNumber,
          gender,
          ...(avatar === null ? {} : { avatar }),
        },
      });

      const { update_user } = data ?? {};
      const { success, message } = update_user ?? {};

      return { success, message };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeUpdateDriverMutation, loading };
}

export function useGetDriversQuery({
  table,
  currentFilters,
}: {
  table?: UseTableReturn;
  currentFilters?: IDriverTableFilters;
}) {
  let isOnlineValue: boolean | null;
  if (currentFilters?.isOnline === 'all') {
    isOnlineValue = null;
  } else if (currentFilters?.isOnline === 'true') {
    isOnlineValue = true;
  } else {
    isOnlineValue = false;
  }

  const { data, loading, refetch } = useQuery(getDriversQuery, {
    variables: {
      ...currentFilters,
      isOnline: isOnlineValue,
      page: (table?.page ?? 0) + 1,
      limit: table?.rowsPerPage,
      order: table?.orderBy,
      sort: table?.order,
    },
  });

  const { get_drivers } = data ?? {};
  const { datas, count } = get_drivers ?? {};

  return { datas, loading, count, refetch };
}

export const useChangeStatusDriver = ({ refetch }: { refetch: () => void }) => {
  const [changeStatus, { loading }] = useMutation(changeStatusDriver);

  const executeChangeStatusDriver = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }) => {
    try {
      const { data } = await changeStatus({
        variables: {
          changeStatusDriverId: rowId,
          status,
        },
      });

      const { change_status_driver } = data ?? {};
      const { success, message } = change_status_driver ?? {};

      if (success) {
        refetch();
      }

      return handleRequest(message, success);
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeChangeStatusDriver, loading };
};

export const useUpdateDriverMutation = () => {
  const [updateDriver, { loading }] = useMutation(updateDriverMutation);

  const executeUpdateDriver = async ({
    rowId,
    type,
    deviceId,
  }: {
    rowId: string;
    type: string;
    deviceId: string;
  }) => {
    try {
      const { data } = await updateDriver({
        variables: {
          updateDriverId: rowId,
          type,
          deviceId,
        },
      });

      const { update_driver } = data ?? {};
      const { success, message } = update_driver ?? {};

      return { message, success };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeUpdateDriver, loading };
};

export const useCreateUpdateVehicleMutation = ({ row }: { row?: IDriver | null }) => {
  const [vehicleMutation, { loading }] = useMutation(
    row?.vehicle ? updateVehicleMutation : createVehicleMutation
  );

  const executeCreateUpdateVehicle = async ({
    variables,
  }: {
    variables: {
      updateVehicleId?: string;
      vehicleModelId?: string;
      userId?: string;
      licencePlate?: string;
      certificate: string;
      color: string;
      importDate: string;
    };
  }) => {
    try {
      const { data } = await vehicleMutation({
        variables: {
          ...variables,
          ...(row?.vehicle ? { updateVehicleId: row?.vehicle?.id } : { userId: row?.user?.id }),
        },
      });

      const vehicle = data?.update_vehicle ?? data?.create_vehicle;
      const { success, message } = vehicle ?? {};

      return { message, success };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeCreateUpdateVehicle, loading };
};
