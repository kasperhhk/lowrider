'use client'

import '@/styles/globals.css'
import { Box, CssBaseline, NoSsr, ThemeProvider, Toolbar } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../styles/theme'
import Head from 'next/head';
import { ServerListProvider } from '../providers/ServerListProvider';
import { AuthRouteGuard, isLoginPage } from '../providers/AuthRouteGuard';
import { UserProvider } from '../providers/UserProvider';
import TopToolbar from '../components/TopToolbar';
import { ConnectionProvider } from '../providers/ConnectionProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ChatBar } from '../components/Chat/ChatBar'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const includeProviders = !isLoginPage(router.asPath);

  useEffect(() => {
    console.log("app mounted");
    return () => console.log("app unmounted");
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NoSsr>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {!includeProviders && <Component {...pageProps} />}

          {includeProviders &&
            <AuthRouteGuard>
              <UserProvider>
                <ServerListProvider>
                  <ConnectionProvider>

                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <TopToolbar />
                      </Box>
                      <Box><ChatBar /></Box>
                      <Box component="main" sx={{ p: 3}}>
                        <Toolbar />
                        <Component {...pageProps} />
                      </Box>
                    </Box>

                  </ConnectionProvider>
                </ServerListProvider>
              </UserProvider>
            </AuthRouteGuard>}

        </ThemeProvider>
      </NoSsr>
    </>
  );
}
