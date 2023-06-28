import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { ConnectionContext } from '../../providers/ConnectionProvider';
import { ServerDefinition } from '../../providers/ServerListProvider';
import { UserContext } from '../../providers/UserProvider';
import { WEBSOCKET_URL } from '../../utils';
import { useRouter } from 'next/router';

interface OutgoingChatMessage {
  message: string
}

interface IncomingChatMessage {
  sender: string,
  message: string
}

declare type ChatMessage = TimestampedChatMessage | SystemChatMessage;

interface TimestampedChatMessage {
  type: 'chatmsg',
  sender: string,
  message: string,
  timestamp: Date,
  id: number
}

interface SystemChatMessage {
  type: 'systemchatmsg',
  message: string,
  timestamp: Date,
  id: number
}

export default function Chat() {
  const { connectedServer } = useContext(ConnectionContext);
  const router = useRouter();

  if (!connectedServer) {
    router.push('/servers');
    return <></>;
  }

  return <ChatWindow server={connectedServer}></ChatWindow>;
}

let nextId = 0;
function createId() {
  return nextId++;
}

function createTimestamp() {
  const date = new Date();
  return date;
}

function createSystemChatMsg(message: string): SystemChatMessage {
  const timestamp = createTimestamp();
  return {
    type: 'systemchatmsg',
    timestamp: timestamp,
    message,
    id: createId()
  }
}

export function ChatWindow({ server }: { server: ServerDefinition }) {
  const user = useContext(UserContext);

  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([createSystemChatMsg('Connecting...')]);

  const onClose = useCallback(() => {
    setMessageHistory(m => [...m, createSystemChatMsg('Disconnected!'), createSystemChatMsg('Reconnecting...')]);
  }, [setMessageHistory])

  const onOpen = useCallback(() => {
    setMessageHistory(m => [...m, createSystemChatMsg('Connected.')]);
  }, [setMessageHistory]);

  const websocketUrl = WEBSOCKET_URL(server, user);
  const { lastMessage, sendMessage } = useWebSocket(websocketUrl, {
    share: true,
    retryOnError: true,
    shouldReconnect: () => true,
    reconnectAttempts: 100,
    onClose,
    onOpen
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = lastMessage.data as string;
      console.log("messageData", messageData);

      const json = messageData.slice("CHATMSG:".length);
      const rawMessage = JSON.parse(json) as IncomingChatMessage;
      const timestamp = createTimestamp();
      const id = createId();
      const timestampedMessage = { ...rawMessage, timestamp, type: 'chatmsg', id } as TimestampedChatMessage;

      setMessageHistory(m => [...m, timestampedMessage]);
    }
  }, [lastMessage, setMessageHistory]);

  const sendChatMessage = useCallback((message: string) => {
    const data: OutgoingChatMessage = { message: message };
    const json = JSON.stringify(data);
    const messageData = "CHATMSG:" + json;

    sendMessage(messageData);
  }, [sendMessage]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = (e.target as any).message as HTMLInputElement;
    const message = target.value;

    sendChatMessage(message);
    target.value = "";
  }

  const ref = useRef<HTMLDivElement>(null);

  return (<>
    <Stack ref={ref}>
      {messageHistory.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </Stack>
    <form onSubmit={handleSubmit}>
      <TextField id="message" helperText="Send chat message" variant="filled" autoFocus autoComplete='off' />
    </form>
  </>
  );
}

function timestampFormat(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function ChatMessage({ message }: { message: ChatMessage }) {
  if (message.type === 'chatmsg') {
    return <Box><time>[{timestampFormat(message.timestamp)}]</time><span>{message.sender}</span><span>:</span><span>{message.message}</span></Box>;
  }
  else if (message.type === 'systemchatmsg') {
    return <Box><time>[{timestampFormat(message.timestamp)}]</time><span>{message.message}</span></Box>;
  }

  return <></>;
}