import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { LogoutButton } from './LogoutButton';
import MenuIcon from '@mui/icons-material/Menu';

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