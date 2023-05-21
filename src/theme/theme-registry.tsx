"use client"

import { PropsWithChildren } from 'react'
import theme from '../theme/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'

export default function ThemeRegistry({children}: PropsWithChildren) {
  return (
    <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
    </>
  );
}