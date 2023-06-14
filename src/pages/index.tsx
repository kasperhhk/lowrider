import { useContext } from 'react';
import ServerOverview from '../components/ServerOverview/ServerOverview';
import { UserContext } from '../providers/UserProvider';
import { Box, Stack } from '@mui/material';

export default function Home() {
  const user = useContext(UserContext);

  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <Stack>
        <h1>Hey {user.username}!</h1>
        <ServerOverview />
      </Stack>
    </Box>);
}