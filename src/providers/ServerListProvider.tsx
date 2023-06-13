import { createContext, Dispatch, SetStateAction, PropsWithChildren, useState, useEffect } from 'react';
import { ISSERVER } from '../utils';

export interface ServerDefinition {
  name: string;
  host: string;
}

const localStorageKey = "ServerList";
function getInitialState(): ServerDefinition[] {
  if (ISSERVER)
    return [];

  const servers = localStorage.getItem(localStorageKey);
  return servers ? JSON.parse(servers) : [];
}

export const ServerListContext = createContext<{ serverList: ServerDefinition[], setServerList: Dispatch<SetStateAction<ServerDefinition[]>> }>({} as any);

export const ServerListProvider: React.FC<PropsWithChildren> = props => {
  const [serverList, setServerList] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(serverList));
  }, [serverList]);

  return <ServerListContext.Provider value={{ serverList, setServerList }}>
    {props.children}
  </ServerListContext.Provider>;
}