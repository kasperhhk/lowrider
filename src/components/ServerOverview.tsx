import { IconButton, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { ServerListContext, ServerDefinition } from '../providers/ServerListProvider';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import AddServerDialog from './AddServerDialog';

export default function ServerOverview() {
  const {serverList, setServerList} = useContext(ServerListContext);
  const [openConfirmDelete, setConfirmDelete] = useState(false);
  const [openAdd, setAdd] = useState(false);

  function closeConfirmDelete(confirmed: boolean, server?: ServerDefinition) {
    setConfirmDelete(false);

    if (confirmed) {
      setServerList(current => current.filter(c => c != server));
    }
  }

  function openDeleteConfirm() {
    setConfirmDelete(true);
  }

  function handleAddClose(server?: ServerDefinition) {
    setAdd(false);

    if (server) {
      setServerList(current => [...current, server]);
    }
  }

  return (<>
    <ul>
      {serverList.map(server => 
        <li key={server.host}>
          <span>{server.name} ({server.host})</span>
          <IconButton color='error' onClick={() => openDeleteConfirm()}><HighlightOffSharpIcon/></IconButton>
          <Dialog open={openConfirmDelete} onClose={() => closeConfirmDelete(false)}>
            <DialogTitle>
              Delete server &quot;{server.name}&quot; ({server.host})?
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => closeConfirmDelete(false)}>No</Button>
              <Button onClick={() => closeConfirmDelete(true, server)} color="error">Yes</Button>
            </DialogActions>
          </Dialog>
        </li>
      )}
    </ul>
    <Button variant="contained" onClick={() => setAdd(true)}>Add Server</Button>
    <AddServerDialog open={openAdd} onClose={(server) => handleAddClose(server)}/>
  </>);
}