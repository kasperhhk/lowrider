import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
   smp: true;
   p: true;
  }
}

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const defaults = createTheme();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd180',
    },
    secondary: {
      main: '#80afff',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  breakpoints: {
    values: {
      ...defaults.breakpoints.values,
      smp: 300,
      p: 400
    }
  }
});

export default theme;