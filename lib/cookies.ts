'use server';

import { cookies } from 'next/headers';

export async function setCookie(key: string, value: string, options?: { httpOnly?: boolean; secure?: boolean; maxAge?: number }) {
  (await cookies()).set(key, value, { ...options });
}
