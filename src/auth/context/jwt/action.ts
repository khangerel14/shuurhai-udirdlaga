'use client';

import { useMutation } from '@apollo/client';

import axios, { endpoints } from 'src/lib/axios';
import { signInMutation } from 'src/graphql/mutations';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const useSignInWithPassword = () => {
  const [signIn, { loading }] = useMutation(signInMutation);

  const executeSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ message: string; success: boolean }> => {
    try {
      const { data } = await signIn({ variables: { email, password } });

      const { sign_in_by_admin } = data ?? {};
      const { success, message, token: accessToken } = sign_in_by_admin ?? {};

      setSession(accessToken);
      return { message, success };
    } catch (error) {
      console.error('Error during sign in:', error);
      setSession(null);
      throw error;
    }
  };

  return { executeSignIn, loading };
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
