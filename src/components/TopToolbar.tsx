import { AppBar, Box, Toolbar } from '@mui/material';
import { LogoutButton } from './LogoutButton';

export default function TopToolbar() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{flexDirection: 'row-reverse' }}>
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}