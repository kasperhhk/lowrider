import { Box, Drawer, Toolbar } from '@mui/material';
import Chat from './ChatWindow';

export function ChatBar() {
  return (
    <>
      <Drawer anchor='right' variant="permanent" sx={{ width: '300px', flexShrink: 0, [`& .MuiDrawer-paper`]: { width: '300px', boxSizing: 'border-box' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Chat />
        </Box>
      </Drawer>
    </>
  );
}