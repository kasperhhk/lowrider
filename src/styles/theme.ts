import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red, } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
/*
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red[900],
    },
    background: {
      default: "#bbbbbb"
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
*/

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
});

export default theme;