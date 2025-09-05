import type { IUserTableFilters } from 'src/types/user';
import type { ROLE, GENDER_ENUM } from 'src/types/common';
import type { UseTableReturn } from 'src/components/table';

import { useQuery, useMutation } from '@apollo/client';

import { createUserMutation } from 'src/graphql/mutations';
import { getUsersQuery } from 'src/graphql/queries/user.query';
import { changeStatusUser, updateUserMutation } from 'src/graphql/mutations/user.mutation';

import { handleRequest } from 'src/components/request/handle-request';

export function useUserMutation() {
  const [userMutation, { loading }] = useMutation(createUserMutation);

  const executeUserMutation = async ({
    role,
    firstName,
    lastName,
    email,
    password,
    avatar,
  }: {
    role: ROLE | null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string | null;
  }) => {
    try {
      const { data } = await userMutation({
        variables: {
          role,
          firstName,
          lastName,
          email,
          password,
          ...(avatar === null ? {} : { avatar }),
        },
      });

      const { create_user } = data ?? {};
      const { success, message } = create_user ?? {};

      return { success, message };
    } catch (error) {
      console.error('Error executing user mutation:', error);
      throw error;
    }
  };
  return { executeUserMutation, loading };
}

export const useGetUsersQuery = ({
  table,
  currentFilters,
}: {
  table: UseTableReturn;
  currentFilters: IUserTableFilters;
}) => {
  const { data, loading, refetch } = useQuery(getUsersQuery, {
    variables: {
      ...currentFilters,
      page: table.page + 1,
      limit: table.rowsPerPage,
      order: table.orderBy,
      sort: table.order,
    },
  });

  const { get_users } = data ?? {};
  const { users, count } = get_users ?? {};

  return { users, loading, count, refetch };
};

export const useChangeStatusUserMutation = () => {
  const [changeStatus, { loading }] = useMutation(changeStatusUser);

  const executeStatusUserMutation = async ({
    rowId,
    status,
  }: {
    rowId: string;
    status: string;
  }) => {
    try {
      const { data } = await changeStatus({
        variables: {
          changeStatusUserId: rowId,
          status,
        },
      });

      const { change_status_user } = data ?? {};
      const { success, message } = change_status_user ?? {};

      return handleRequest(message, success);
    } catch (error) {
      console.error('Error executing user mutation:', error);
      throw error;
    }
  };
  return { executeStatusUserMutation, loading };
};

export function useUserUpdateMutation() {
  const [userUpdateMutation, { loading }] = useMutation(updateUserMutation);

  const executeUpdateUserMutation = async ({
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
      const { data } = await userUpdateMutation({
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

  return { executeUpdateUserMutation, loading };
}
