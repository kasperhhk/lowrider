import { TextField, Button, DialogContent, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { FormEvent, useState } from 'react';
import { ServerDefinition } from '../providers/ServerListProvider';

const initialState = {
  name: {
    value: '',
    error: false
  },
  host: {
    value: '',
    error: false
  }
}

export default function AddServerDialog({ open, onClose }: { open: boolean, onClose: (server?: ServerDefinition) => void }) {
  const [name, setName] = useState(initialState.name);
  const [host, setHost] = useState(initialState.host);

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    handleClose(true);
  }

  function reset() {
    setName(initialState.name);
    setHost(initialState.host);
  }

  function handleClose(submit: boolean) {
    if (!submit) {
      reset();
      onClose();
      return;
    }

    let error = false;
    if (!name.value) {
      setName({ value: name.value, error: true });
      error = true;
    }
    if (!host.value) {
      setHost({ value: host.value, error: true });
      error = true;
    }

    if (error) {
      return;
    }

    onClose({ name: name.value, host: host.value });
    reset();
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>
        Add Server
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField id="name" label="Name" variant="outlined" error={name.error} helperText="Name is required" value={name.value} onChange={e => setName(c => ({ error: false, value: e.target.value }))} required />
          <TextField id="host" label="Server" variant="outlined" error={host.error} helperText="Server is required" value={host.value} onChange={e => setHost(c => ({ error: false, value: e.target.value }))} required />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <Button onClick={() => handleClose(true)} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}