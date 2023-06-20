import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ConnectionContext } from '../providers/ConnectionProvider';
import useWebSocket from 'react-use-websocket';
import { ServerDefinition } from '../providers/ServerListProvider';
import { UserContext } from '../providers/UserProvider';
import { WEBSOCKET_URL } from '../utils';
import { Box, Stack, TextField, Typography } from '@mui/material';

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
  timestamp: string
}

interface SystemChatMessage {
  type: 'systemchatmsg',
  message: string,
  timestamp: string
}

export default function Chat() {
  const { connectedServer } = useContext(ConnectionContext);

  if (!connectedServer) {
    //router.push('/');
    return <></>;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack>
        <Typography variant="h1">Chat</Typography>
        {connectedServer && <ChatWindow server={connectedServer}></ChatWindow>}
      </Stack>
    </Box>
  );
}

function createTimestamp() {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function createSystemChatMsg(message: string): SystemChatMessage {
  const date = new Date();

  return {
    type: 'systemchatmsg',
    timestamp: createTimestamp(),
    message
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
      const timestampedMessage = { ...rawMessage, timestamp, type: 'chatmsg' } as TimestampedChatMessage;

      setMessageHistory(m => [...m, timestampedMessage]);
    }
  }, [lastMessage, setMessageHistory]);

  const sendChatMessage = useCallback((message: string) => {
    const data: OutgoingChatMessage = { message: message };
    const json = JSON.stringify(data);
    const messageData = "CHATMSG:" + json;

    sendMessage(messageData);
  }, [sendMessage]);

  const chatareaRef = useRef<HTMLTextAreaElement>();
  useEffect(() => {
    if (chatareaRef.current)
      chatareaRef.current.scrollTop = chatareaRef.current.scrollHeight;
  }, [messageHistory]);

  function formatMessageHistory() {
    return messageHistory.map(m => {
      if (m.type === 'chatmsg')
        return formatChatMessage(m);
      if (m.type === 'systemchatmsg')
        return formatSystemMessage(m);
    }).join('\n');
  }

  function formatChatMessage(message: TimestampedChatMessage) {
    return `[${message.timestamp}] ${message.sender}: ${message.message}`;
  }

  function formatSystemMessage(message: SystemChatMessage) {
    return `[${message.timestamp}] ${message.message}`;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = (e.target as any).message as HTMLInputElement;
    const message = target.value;

    sendChatMessage(message);
    target.value = "";
  }

  return (
    <Stack>
      <TextField disabled label="Chat" rows={10} multiline value={formatMessageHistory()} fullWidth inputRef={chatareaRef} />
      <form onSubmit={handleSubmit}>
        <TextField id="message" helperText="Send chat message" variant="filled" autoFocus autoComplete='off' />
      </form>
    </Stack>
  );
}