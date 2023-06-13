import { useContext } from 'react';
import ServerOverview from '../components/ServerOverview/ServerOverview';
import { UserContext } from '../providers/UserProvider';
import { Stack } from '@mui/material';

export default function Home() {
  const user = useContext(UserContext);

  return (<Stack>
    <h1>Hey {user.username}!</h1>
    <ServerOverview />
  </Stack>);
}