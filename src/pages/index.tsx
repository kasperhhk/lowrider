import { Inter } from 'next/font/google'
import { Box, Button, Container, Stack, TextField } from '@mui/material'
import styles from '../styles/Home.module.css';
import { FormEvent, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [messages, setMessages] = useState<TimestampedChatMessage[]>([]);

  const [error, setError] = useState<any>();

  const [webSocket, setWebSocket] = useState<WebSocket>();

  async function connect(info: ConnectionInfo) {
    setConnectionInfo(info);
    setConnecting(true);

    webSocket?.close();
    var newWebSocket = new WebSocket(`ws://${info.host}:${info.port}/ws/${info.username}`);

    newWebSocket.onopen = event => {
      setConnected(true);
      setConnecting(false);
      console.log("WebSocket open", event);
    };

    newWebSocket.onmessage = event => {
      const json = event.data;
      const rawMessage: IncomingChatMessage = JSON.parse(json);
      const date = new Date();
      const timestamp = `${date.getHours()}:${date.getMinutes()}`;
      const timestampedMessage = { ...rawMessage, timestamp };
      
      const addMessage = [...messages, timestampedMessage];
      setMessages(addMessage);
      console.log("WebSocket message", event);
    };

    newWebSocket.onerror = event => {
      setConnected(false);
      setError(event);
      console.log("WebSocket error", event);
    }

    newWebSocket.onclose = event => {
      setConnected(false);
      setError("CLOSED OKAY");
      console.log("WebSocket close", event);
    }

    setWebSocket(newWebSocket);
  }

  function handleChatMessage(message: string) {
    if (!webSocket) return;
    const data: OutgoingChatMessage = { message: message };
    const json = JSON.stringify(data);
    webSocket.send(json);
  }

  return (
    <Container maxWidth="lg">
      <Container>
        <main>
          <h1 className={styles.header}>Hej!</h1>
        </main>
      </Container>
      {error && <Container className={styles.error}><h1>ERROR: {error.toString()}</h1></Container>}
      <Box display="flex" justifyContent="center" alignItems="center">
        {!connectionInfo && <ChatSetup onConnect={connect}/>}
        {connecting && <span>Connecting...</span>}
        {connectionInfo && !connecting && !connected && <span>Disconnected.</span>}
        {connected && <Chat messages={messages} onChatMessage={handleChatMessage}/>}
      </Box>
    </Container>
  );
}

interface OutgoingChatMessage {
  message: string
}

interface IncomingChatMessage {
  sender: string,
  message: string
}

interface TimestampedChatMessage extends IncomingChatMessage {
  timestamp: string
}

interface ChatProps {
  messages: TimestampedChatMessage[],
  onChatMessage: (message: string) => void
}

export function Chat({ messages, onChatMessage }: ChatProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target: any = e.target;
    onChatMessage(target.message.value);
  }

  function formatMessages() {
    return messages.map(m => `[${m.timestamp}] ${m.sender}: ${m.message}`).join('\n');
  }

  return (
    <>
      <textarea readOnly value={formatMessages()}></textarea>
      <form onSubmit={handleSubmit}>
        <input type="text" id="message" name="message" />
      </form>
    </>
  );
}

interface ConnectionInfo {
  username: string;
  host: string;
  port: string;
}

interface ChatSetupProps {
  onConnect: (info: ConnectionInfo) => void
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