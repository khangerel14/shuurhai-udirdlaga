'use client';

import { CONFIG } from 'src/global-config';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const FILE_URL = CONFIG.assetsDir;

export const fileAttach = async (file: File) => {
  try {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('type', 'odm');
    const response: any = await fetch(FILE_URL || '', {
      method: 'POST',
      headers: {
        authorization: sessionStorage.getItem(STORAGE_KEY) ?? '',
      },
      body: formdata,
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(response.statusText);
    const { success, message } = await response.json();
    return {
      success,
      message: 'Амжилттай',
      url: message,
    };
  } catch (err: any) {
    return { success: false, message: err.message, url: null };
  }
};
