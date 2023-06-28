import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { LogoutButton } from './LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';
import { ServerDisconnect } from './ServerDisconnect';

export default function TopToolbar() {
  const user = useContext(UserContext);

  return (
      <AppBar position="fixed">
        <Toolbar sx={{ flexGrow: 1, gap: '20px' }}>
          <Box component={'div'} sx={{ flexGrow: 1 }}><ServerDisconnect /></Box>
          <Typography variant='h6' component={'div'}>{user.username}</Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>
  );
}