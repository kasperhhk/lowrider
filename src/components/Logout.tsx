import { Button } from '@mui/material';
import { userService } from '../providers/UserService';
import { useRouter } from 'next/router';

export function Logout() {
  const router = useRouter();

  function handleLogout() {
    userService.logout();
    router.push('/login');
  }

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}