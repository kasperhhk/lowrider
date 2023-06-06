import { Inter } from 'next/font/google'
import { Box, Button, Container, Stack, TextField, TextareaAutosize } from '@mui/material'
import styles from '../styles/Home.module.css';
import { FormEvent, useEffect, useRef, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({});
  const [messages, setMessages] = useState<TimestampedChatMessage[]>([]);
  const [webSocket, setWebSocket] = useState<WebSocket>();

  function onConnect(connection: ChatConnection) {
    doConnect(connection, false);
  }

  function doConnect(connection: ChatConnection, retry: boolean) {
    setConnectionStatus({
      connecting: true,
      wasDisconnected: retry
    });

    webSocket?.close();
    const newWebSocket = new WebSocket(`ws://${connection.host}:${connection.port}/ws/${connection.username}`);

    newWebSocket.onopen = event => {
      setConnectionStatus({
        connected: true
      });
      console.log("WebSocket open", event);
    };

    newWebSocket.onmessage = event => {
      const messageData: string = event.data;
      console.log("messageData", messageData);

      const json = messageData.slice("CHATMSG:".length);
      const rawMessage: IncomingChatMessage = JSON.parse(json);
      const date = new Date();
      const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const timestampedMessage = { ...rawMessage, timestamp };
      
      setMessages(m => [...m, timestampedMessage]);
    };

    newWebSocket.onerror = event => {
      console.log("WebSocket error", event);
      newWebSocket.close();
    }

    newWebSocket.onclose = event => {
      console.log("WebSocket close", event);

      setConnectionStatus({
        wasDisconnected: true
      });
      doConnect(connection, true);
    }

    setWebSocket(newWebSocket);
  }

  function handleChatMessage(message: string) {
    if (!webSocket) return;
    const data: OutgoingChatMessage = { message: message };
    const json = JSON.stringify(data);
    const messageData = "CHATMSG:" + json;
    webSocket.send(messageData);
  }

  return (
    <Container maxWidth="lg">
      <Container>
        <main>
          <h1 className={styles.header}>Chat</h1>
        </main>
      </Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <ConnectionInfo connectionStatus={connectionStatus}/>
        {!connectionStatus.connecting && !connectionStatus.connected && <ChatSetup onConnect={onConnect}/>}
        {connectionStatus.connected && <ChatMessages messages={messages} onChatMessage={handleChatMessage}/>}
      </Box>
    </Container>
  );
}

interface ConnectionStatus {
  connected?: boolean;
  connecting?: boolean;
  wasDisconnected?: boolean;
}

interface ConnectionInfoProps {
  connectionStatus: ConnectionStatus;
}

export function ConnectionInfo({ connectionStatus }: ConnectionInfoProps) {
  if (connectionStatus.connecting) {
    if (connectionStatus.wasDisconnected) {
      return <span>Disconnected! Reconnecting...</span>
    }
    else {
      return <span>Connecting...</span>
    }
  }

  return <></>;
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

export function ChatMessages({ messages, onChatMessage }: ChatProps) {
  const chatareaRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (chatareaRef.current)
      chatareaRef.current.scrollTop = chatareaRef.current.scrollHeight;
  }, [messages]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target: any = e.target;
    onChatMessage(target.message.value);
    target.message.value = "";
  }

  function formatMessages() {
    return messages.map(m => `[${m.timestamp}] ${m.sender}: ${m.message}`).join('\n');
  }

  return (
    <Stack direction="column" spacing={0} className={styles.stack}>
      <TextField disabled label="Chat" rows={10} multiline value={formatMessages()} fullWidth className={styles.chatarea} inputRef={chatareaRef}/>
      <form onSubmit={handleSubmit}>
        <TextField id="message" helperText="Send chat message" variant="filled" autoFocus autoComplete="off"/>
      </form>
    </Stack>
  );
}

interface ChatConnection {
  username: string;
  host: string;
  port: string;
}

interface ChatSetupProps {
  onConnect: (connection: ChatConnection) => void
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