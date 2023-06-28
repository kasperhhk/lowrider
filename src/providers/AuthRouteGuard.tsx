import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { userService } from './UserService';
import { LOGIN_PAGE, isLoginPage } from '../route-utils';

export function AuthRouteGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  if (!isLoginPage(router.asPath) && !userService.user) {
    router.push(LOGIN_PAGE);
    return <></>;
  }

  return <>{children}</>;
}