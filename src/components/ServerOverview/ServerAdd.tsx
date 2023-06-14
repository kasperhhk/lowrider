import { useContext, useState } from 'react';
import { ServerListContext, ServerDefinition } from '../../providers/ServerListProvider';
import { Button } from '@mui/material';
import ServerAddDialog from './ServerAddDialog';

export default function ServerAdd() {
  const { setServerList } = useContext(ServerListContext);
  const [openAdd, setAdd] = useState(false);

  function handleAddClose(server?: ServerDefinition) {
    setAdd(false);

    if (server) {
      setServerList(current => [...current, server]);
    }
  }

  return (<>
    <Button variant="contained" onClick={() => setAdd(true)} sx={{ marginTop: '20px', width: '150px' }}>Add Server</Button>
    <ServerAddDialog open={openAdd} onClose={(server) => handleAddClose(server)} />
  </>)
}