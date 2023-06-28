import { IconButton, Dialog, DialogTitle, DialogActions, Button, Stack, Card, Typography, CardActionArea, CardContent, useTheme, alpha } from '@mui/material';
import { ServerDefinition, ServerListContext } from '../../providers/ServerListProvider';
import { useContext, useState } from 'react';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { ConnectionContext } from '../../providers/ConnectionProvider';

export default function ServerList() {
  const { serverList, setServerList } = useContext(ServerListContext);
  const { connectedServer, connect, disconnect } = useContext(ConnectionContext);

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, server?: ServerDefinition }>({ open: false });
  const theme = useTheme();

  function closeConfirmDelete(confirmed: boolean, server?: ServerDefinition) {
    setConfirmDelete({ open: false });

    if (confirmed) {
      setServerList(current => current.filter(c => c != server));
    }
  }

  function openDeleteConfirm(server: ServerDefinition) {
    setConfirmDelete({ open: true, server });
  }

  function isConnected(server: ServerDefinition) {
    return connectedServer === server;
  }

  function getCardBackground(server: ServerDefinition) {
    return isConnected(server) ? alpha(theme.palette.success.main, 0.1) : theme.palette.background.paper;
  }
  
  function handleClick(server: ServerDefinition) {
    if (isConnected(server)) {
      disconnect();
    }
    else {
      connect(server);
    }
  }

  return (
    <>
      <Stack sx={{ gap: '10px' }}>
        {serverList.map(server =>
          <Stack key={server.host} direction={'row'} sx={{ width: { xs: '230px', smp: '250px', p: '350px', sm: '400px' }}}>
            <Card elevation={2} sx={{flex: '1 1 100%', backgroundColor: getCardBackground(server) }}>
              <CardActionArea onClick={() => handleClick(server)}>
                <CardContent>
                  <Stack direction={'row'} justifyContent='space-between' sx={{ }}>
                    <Typography variant="h5" color="secondary" component='div'>{server.name}</Typography>
                    <Typography variant="caption" component='div' sx={{display: 'flex', alignItems: 'center'}}>{server.host}</Typography>
                  </Stack>
                  {isConnected(server) && <Typography component='div' sx={{marginTop: '20px', justifyContent: 'center', display: 'flex'}}>Connected</Typography>}
                  {!isConnected(server) && <Typography component='div' color="primary" sx={{marginTop: '20px', justifyContent: 'center', display: 'flex'}}>Connect</Typography>}
                </CardContent>
              </CardActionArea>
            </Card>
            <IconButton color='error' onClick={() => openDeleteConfirm(server)} sx={{borderRadius: '0'}}><HighlightOffSharpIcon /></IconButton>
            <Dialog open={confirmDelete.open && confirmDelete.server === server} onClose={() => closeConfirmDelete(false)}>
              <DialogTitle>
                Delete server &quot;{server.name}&quot; ({server.host})?
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => closeConfirmDelete(false)}>No</Button>
                <Button onClick={() => closeConfirmDelete(true, server)} color="error">Yes</Button>
              </DialogActions>
            </Dialog>
          </Stack>
        )}
      </Stack>
    </>
  );
}