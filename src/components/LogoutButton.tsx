import { Button } from '@mui/material';
import { userService } from '../providers/UserService';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ConnectionContext } from '../providers/ConnectionProvider';
import { LOGIN_PAGE } from '../route-utils';

export function LogoutButton() {
  const router = useRouter();
  const { disconnect } = useContext(ConnectionContext);

  function handleLogout() {
    userService.logout();
    router.push(LOGIN_PAGE);
    disconnect();
  }

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}