import type { UseTableReturn } from 'src/components/table';
import type { DIALOG_TYPE, STATUS_ENUM } from 'src/types/common';
import type { VehicleModel, IVehicleModelTableFilters } from 'src/types/vehicle-model';

import { useQuery, useMutation } from '@apollo/client';

import { getVehicleModelsQuery } from 'src/graphql/queries';
import {
  createVehicleModelMutation,
  updateVehicleModelMutation,
  changeStatusVehicleModelMutation,
} from 'src/graphql/mutations/vehicle.model.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useGetVehicleModelsQuery({
  open,
  table,
  currentFilters,
}: {
  open?: boolean;
  table?: UseTableReturn;
  currentFilters?: IVehicleModelTableFilters;
}) {
  const { data, loading, refetch } = useQuery(getVehicleModelsQuery, {
    variables: {
      ...currentFilters,
      page: (table?.page ?? 0) + 1,
      limit: table?.rowsPerPage,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_vehicle_models } = data ?? {};
  const { datas, count } = get_vehicle_models ?? {};

  return { datas, loading, count, refetch };
}

export function useChangeVehicleModelStatusMutation({ refetch }: { refetch: () => void }) {
  const [changeStatusVehicleModel, { loading }] = useMutation(changeStatusVehicleModelMutation);

  const executeChangeStatusVehicleModel = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: STATUS_ENUM;
  }) => {
    try {
      const { data } = await changeStatusVehicleModel({
        variables: {
          changeStatusVehicleModelId: rowId,
          status,
        },
      });

      const { change_status_vehicle_model } = data ?? {};
      const { success, message } = change_status_vehicle_model ?? {};

      if (success) {
        refetch();
      }

      return handleRequest(message, success);
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeChangeStatusVehicleModel, loading };
}

export function useCreateUpdateVehicleModelMutation({
  currentRow,
  dialogType,
}: {
  currentRow?: VehicleModel | null;
  dialogType: DIALOG_TYPE;
}) {
  const [createUpdateVehicleModel, { loading }] = useMutation(
    currentRow ? updateVehicleModelMutation : createVehicleModelMutation
  );

  const executeCreateUpdateVehicleModelMutation = async ({
    name,
    vehicleTypeId,
    vehicleManufactureId,
  }: {
    name: string;
    vehicleTypeId: string;
    vehicleManufactureId: string;
  }) => {
    try {
      const { data } = await createUpdateVehicleModel({
        variables: {
          ...(currentRow ? { updateVehicleModelId: currentRow.id } : {}),
          name,
          vehicleTypeId,
          vehicleManufactureId,
        },
      });

      const vehicleModelData = data?.[`${dialogType}_vehicle_model`] ?? {};
      const { success, message } = vehicleModelData;

      return { message, success };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  return { executeCreateUpdateVehicleModelMutation, loading };
}
