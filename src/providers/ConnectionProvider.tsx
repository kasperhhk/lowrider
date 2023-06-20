import { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { ServerDefinition } from './ServerListProvider';
import { useRouter } from 'next/router';

interface Connection {
  connectedServer: ServerDefinition | null;
  connect: (server: ServerDefinition) => void;
  disconnect: () => void;
}

export const ConnectionContext = createContext<Connection>({} as any);

const stat: any = {
  h: []
};
if (typeof window !== "undefined") {
  (window as any).stat = stat;
}

export function ConnectionProvider({ children }: PropsWithChildren) {
  const [connectedServer, setConnectedServer] = useState<ServerDefinition | null>(null);
  const router = useRouter();

  const connect = useCallback((server: ServerDefinition) => {
    setConnectedServer(server);
    router.push('/chat')
  }, [setConnectedServer, router]);

  const disconnect = useCallback(() => {
    setConnectedServer(null);
  }, [setConnectedServer]);

  const [connection, setConnection] = useState<Connection>({ connectedServer: null, connect, disconnect });
  useEffect(() => {
    //console.log("useeffect", connectedServer, connect, disconnect)
    stat.h.push({ connectedServer, connect, disconnect });
    setConnection({ connectedServer, connect, disconnect });

    return () => {
      stat.h.push("cleanup");
    }
  }, [connectedServer, connect, disconnect]);

  useEffect(() => {
    console.log("connectionprovider mounted");
    return () => console.log("connectionprovider unmounted");
  }, []);

  return <ConnectionContext.Provider value={connection}>
    {children}
  </ConnectionContext.Provider>
}
