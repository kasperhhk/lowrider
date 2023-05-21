import { Inter } from 'next/font/google'
import { Box, Button, Container, Stack, TextField } from '@mui/material'
import styles from '../styles/Home.module.css';
import { FormEvent, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  let [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>();
  let [connected, setConnected] = useState<boolean>(false);

  async function connect(info: ConnectionInfo) {
    setConnectionInfo(info);

    await new Promise(resolve => 
      setTimeout(resolve, 2000)
    );

    setConnected(true);
  }

  return (
    <Container maxWidth="lg">
      <Container>
        <main>
          <h1 className={styles.header}>Hej!</h1>
        </main>
      </Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        {!connectionInfo && <ChatSetup onConnect={connect}/>}
        {connectionInfo && !connected && <span>Connecting...</span>}
        {connectionInfo && connected && <span>Connected! :3</span>}
      </Box>
    </Container>
  );
}

interface ConnectionInfo {
  username: string;
  host: string;
  port: string;
}

interface ChatSetupProps {
  onConnect: (info: ConnectionInfo) => void;
}

export function ChatSetup({ onConnect }: ChatSetupProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target: any = e.target;

    onConnect({
      username: target.username.value,
      host: target.host.value,
      port: target.port.value
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2} className={styles.stack}>
        <legend className={styles.legend}>Connection info</legend>
        <TextField id="username" label="Username" variant="outlined" required/>
        <TextField id="host" label="Host" variant="outlined" required/>
        <TextField id="port" label="Port" variant="outlined" required/>
        <Button variant="contained" type="submit">Connect</Button>
      </Stack>
    </form>
  );
}