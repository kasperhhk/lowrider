import { FormEvent, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Box, TextField } from '@mui/material';
import { ServerDefinition } from '../../providers/ServerListProvider';
import { UserContext } from '../../providers/UserProvider';
import { WEBSOCKET_URL } from '../../utils';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

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

const initialMessageHistory = (new Array(50)).fill(0).map((_, i) =>
  createSystemChatMsg('INITIAL ' + i)) as ChatMessage[];
initialMessageHistory.push(createSystemChatMsg('Connecting...'));

export function ChatWindow({ server }: { server: ServerDefinition }) {
  const user = useContext(UserContext);

  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>(initialMessageHistory);

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

  return (<>
    <div style={{ flex: '1', width: '100%', overflow: 'hidden' }}>
      <div style={{ overflow: 'hidden' }}>
        <div>
          {messageHistory.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>
      </div>
    </div>
    <div>
      <form onSubmit={handleSubmit}>
        <TextField id="message" helperText="Send chat message" variant="filled" autoFocus autoComplete='off' />
      </form>
    </div>
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