import { Box, Toolbar } from '@mui/material';
import { ChatWindow } from './ChatWindow';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ConnectionContext } from '../../providers/ConnectionProvider';
import { SERVERLIST_PAGE } from '../../route-utils';

export function ChatBar() {
  const { connectedServer } = useContext(ConnectionContext);
  const router = useRouter();

  if (!connectedServer) {
    if (router.asPath !== SERVERLIST_PAGE)
      router.push(SERVERLIST_PAGE);

    return <></>;
  }

  return (
    <Box sx={{ width: '300px', border: '1px solid rgb(255, 255, 255, 0.30)', paddingLeft: '5px', boxSizing: 'border-box' }}>
      <Toolbar />
      <ChatWindow server={connectedServer} />
    </Box>
  );
}