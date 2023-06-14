import { PropsWithChildren, createContext, useState } from 'react';
import { ServerDefinition } from './ServerListProvider';

export const ConnectionContext = createContext<{ connectedServer: ServerDefinition | null, connect: (server: ServerDefinition) => void, disconnect: () => void }>({} as any);

export function ConnectionProvider({ children }: PropsWithChildren) {
  const [connectedServer, setConnectedServer] = useState<ServerDefinition | null>(null);

  function connect(server: ServerDefinition) {
    setConnectedServer(server);
  }

  function disconnect() {
    setConnectedServer(null);
  }

  return <ConnectionContext.Provider value={{ connectedServer, connect, disconnect }}>
    {children}
  </ConnectionContext.Provider>
}
