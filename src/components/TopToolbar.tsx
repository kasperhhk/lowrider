import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { LogoutButton } from './LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';
import { ServerDisconnect } from './ServerDisconnect';

export default function TopToolbar() {
  const user = useContext(UserContext);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{flexDirection: 'row-reverse', gap: '20px' }}>
          <LogoutButton />
          <Typography variant='h6' component={'div'}>{user.username}</Typography>
          <ServerDisconnect />
        </Toolbar>
      </AppBar>
    </Box>
  );
}