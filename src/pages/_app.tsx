import '@/styles/globals.css'
import { CssBaseline, NoSsr, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import theme from '../styles/theme'
import Head from 'next/head';
import { ServerListProvider } from '../providers/ServerListProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NoSsr>
        <ServerListProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </ServerListProvider>
      </NoSsr>
    </>
  );
}
