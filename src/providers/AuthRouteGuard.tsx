import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { userService } from './UserService';

export const publicPaths = ['/login'];
export function isPublicPage(path: string) {
  return publicPaths.includes(path);
}

export function AuthRouteGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  if (!isPublicPage(router.asPath) && !userService.user) {
    router.push('/login');
    return <></>;
  }

  return <>{children}</>;
}