import type { UseTableReturn } from 'src/components/table';
import type { ICommitteeType, ICommitteeTypeTableFilters } from 'src/types/location-committee';

import { useQuery, useMutation } from '@apollo/client';

import { getCommitteesQuery } from 'src/graphql/queries/location.committee.query';
import {
  createCommitteeMutation,
  updateCommitteeMutation,
  changeStatusCommitteeMutation,
} from 'src/graphql/mutations/location.committee.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useGetCommitteesQuery({
  open,
  table,
  districtId,
  currentFilters,
}: {
  open?: boolean;
  table?: UseTableReturn;
  districtId?: string | null;
  currentFilters?: ICommitteeTypeTableFilters;
}) {
  const { data, loading, refetch } = useQuery(getCommitteesQuery, {
    variables: {
      ...currentFilters,
      districtId,
      page: table?.page,
      limit: table?.rowsPerPage,
      order: table?.orderBy,
      sort: table?.order,
    },
    skip: !open,
  });

  const { get_sub_districts } = data ?? {};
  const { datas, count } = get_sub_districts ?? [];

  return { datas, loading, count, refetch };
}

export function useCreateOrUpdateCommitteeMutation({
  currentRow,
}: {
  currentRow?: ICommitteeType | null;
}) {
  const [committeeMutation, { loading }] = useMutation(
    currentRow ? updateCommitteeMutation : createCommitteeMutation
  );

  const executeCommitteeMutation = async (variables: {
    name: string;
    districtId: string;
  }): Promise<{ message: string; success: boolean }> => {
    const { data } = await committeeMutation({
      variables: {
        ...variables,
        ...(currentRow && { updateSubDistrictId: currentRow.id }),
      },
    });

    const { create_sub_district, update_sub_district } = data ?? {};
    const { success, message } = create_sub_district ?? update_sub_district ?? {};

    return { success, message };
  };

  return { executeCommitteeMutation, loading };
}

export function useChangeStatusCommitteeMutation({ refetch }: { refetch: () => void }) {
  const [changeStatusCommittee, { loading }] = useMutation(changeStatusCommitteeMutation);

  const executeChangeStatusCommittee = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }): Promise<void> => {
    const { data: response } = await changeStatusCommittee({
      variables: {
        changeStatusSubDistrictId: rowId,
        status,
      },
    });

    const { change_status_sub_district } = response ?? {};
    const { message, success } = change_status_sub_district ?? {};

    if (success) {
      refetch();
    }

    return handleRequest(message, success);
  };

  return { executeChangeStatusCommittee, loading };
}
