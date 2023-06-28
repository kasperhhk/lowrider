import { useContext } from 'react';
import ServerOverview from '../components/ServerOverview/ServerOverview';
import { UserContext } from '../providers/UserProvider';
import { Box, Stack } from '@mui/material';

export default function Servers() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <Stack>
        <h1>Servers</h1>
        <ServerOverview />
      </Stack>
    </Box>);
}