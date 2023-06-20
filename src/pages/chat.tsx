import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ConnectionContext } from '../providers/ConnectionProvider';
import useWebSocket from 'react-use-websocket';
import { ServerDefinition } from '../providers/ServerListProvider';
import { UserContext } from '../providers/UserProvider';
import { WEBSOCKET_URL } from '../utils';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

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

export default function Chat() {
  const x = useContext(ConnectionContext);
  const connectedServer = x.connectedServer;
  console.log(x);
  const router = useRouter();

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

export function ChatWindow({ server }: { server: ServerDefinition }) {
  const user = useContext(UserContext);

  const websocketUrl = WEBSOCKET_URL(server, user);
  const { lastMessage, sendMessage } = useWebSocket(websocketUrl, {
    share: true,
    retryOnError: true
  });

  const [messageHistory, setMessageHistory] = useState<TimestampedChatMessage[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = lastMessage.data as string;
      console.log("messageData", messageData);

      const json = messageData.slice("CHATMSG:".length);
      const rawMessage = JSON.parse(json) as IncomingChatMessage;
      const date = new Date();
      const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const timestampedMessage = { ...rawMessage, timestamp };

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
    return messageHistory.map(m => `[${m.timestamp}] ${m.sender}: ${m.message}`).join('\n');
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