'use client';

import { useLazyQuery } from '@apollo/client';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { getUserQuery } from 'src/graphql/queries/user.query';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const [currentUser] = useLazyQuery(getUserQuery);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (!accessToken || !isValidToken(accessToken)) {
        setState({ user: null, loading: false });
        return;
      }

      setSession(accessToken);
      const { data } = await currentUser();
      const { get_user_info } = data ?? {};
      const { success, user: fetchedUser } = get_user_info ?? {};

      if (success && fetchedUser) {
        setState({
          user: {
            id: fetchedUser.id,
            firstName: fetchedUser.firstName,
            lastName: fetchedUser.lastName,
            email: fetchedUser.email,
            emailVerified: fetchedUser.emailVerified,
            status: fetchedUser.status,
            role: fetchedUser.role,
            avatar: fetchedUser.avatar,
            gender: fetchedUser.gender,
            displayName: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
            accessToken,
          },
          loading: false,
        });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      setState({ user: null, loading: false });
    }
  }, [setState, currentUser]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
