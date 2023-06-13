import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, useTheme } from '@mui/material';
import { FormEvent, useContext, useState } from 'react';
import { ServerDefinition, ServerListContext } from '../providers/ServerListProvider';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import ServerOverview from '../components/ServerOverview';

export default function Home() {  
  return (<>
    <h1>Hey!</h1>
    <ServerOverview />
  </>);
}