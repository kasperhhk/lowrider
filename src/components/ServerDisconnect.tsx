import { Button } from '@mui/material';
import { useContext } from 'react';
import { ConnectionContext } from '../providers/ConnectionProvider';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';

export function ServerDisconnect() {
  const router = useRouter();
  const { connectedServer, disconnect } = useContext(ConnectionContext);

  function handleClick() {
    disconnect();
    router.push('/');
  }

  return (
    <>
      {connectedServer && <Button endIcon={<LogoutIcon/>} color='warning' onClick={handleClick}>{connectedServer.name}</Button>}
    </>
  );
}