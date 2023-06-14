import '@/styles/globals.css'
import { CssBaseline, NoSsr, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../styles/theme'
import Head from 'next/head';
import { ServerListProvider } from '../providers/ServerListProvider';
import { AuthRouteGuard } from '../providers/AuthRouteGuard';
import { UserProvider } from '../providers/UserProvider';
import TopToolbar from '../components/TopToolbar';
import { ConnectionProvider } from '../providers/ConnectionProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NoSsr>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthRouteGuard render='public'>
            <Component {...pageProps} />
          </AuthRouteGuard>
          <AuthRouteGuard render='private'>
            <UserProvider>
              <ServerListProvider>
                <ConnectionProvider>
                
                <TopToolbar />
                <Component {...pageProps} />

                </ConnectionProvider>
              </ServerListProvider>
            </UserProvider>
          </AuthRouteGuard>
        </ThemeProvider>
      </NoSsr>
    </>
  );
}
