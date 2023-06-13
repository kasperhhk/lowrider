import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { userService } from './UserService';

const publicPaths = ['/login'];
type RenderType = 'public' | 'private';

export function AuthRouteGuard({ children, render }: PropsWithChildren<{ render: RenderType }>) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    authCheck(router.asPath);

    const hideContent = () => setShowContent(false);
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url: string) {
    console.log("Authcheck", url);
    const path = url.split('?')[0];
    const isPublicPath = publicPaths.includes(path);

    if (render === 'public' && isPublicPath) {
      setShowContent(true);
    }
    else if (render === 'private' && !isPublicPath && userService.user) {
      setShowContent(true);
    }
    else if (render === 'private' && !isPublicPath) {
      setShowContent(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      });
    }
  }

  return <>
    {showContent && children}
  </>
}