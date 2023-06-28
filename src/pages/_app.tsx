import { Box, CssBaseline, NoSsr, ThemeProvider, Toolbar } from '@mui/material';
import { AppProps } from 'next/app';
import theme from '../styles/theme';
import Head from 'next/head';
import { ChatBar } from '../components/Chat/ChatBar';
import TopToolbar from '../components/TopToolbar';
import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { AuthRouteGuard, isLoginPage } from '../providers/AuthRouteGuard';
import { UserProvider } from '../providers/UserProvider';
import { ServerListProvider } from '../providers/ServerListProvider';
import { ConnectionProvider } from '../providers/ConnectionProvider';

export function LoggedIn({ children }: PropsWithChildren) {
  return <AuthRouteGuard>
    <UserProvider>
      <ServerListProvider>
        <ConnectionProvider>
          {children}
        </ConnectionProvider>
      </ServerListProvider>
    </UserProvider>
  </AuthRouteGuard>;
}

export function BaseLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  if (isLoginPage(router.asPath)) {
    return <>{children}</>;
  }

  return (
    <LoggedIn>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <TopToolbar />
        </Box>
        <Box><ChatBar /></Box>
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </LoggedIn>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NoSsr>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </ThemeProvider>
      </NoSsr>
    </>
  );
}
