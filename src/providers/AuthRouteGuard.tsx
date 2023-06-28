import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { userService } from './UserService';

const loginPage = '/login';
export function isLoginPage(path: string) {
  return path === loginPage;
}

export function AuthRouteGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  if (!isLoginPage(router.asPath) && !userService.user) {
    router.push('/login');
    return <></>;
  }

  return <>{children}</>;
}