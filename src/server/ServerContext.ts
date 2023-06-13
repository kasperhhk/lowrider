import { createContext } from 'react';

const LOCAL_STORAGE_SERVEROPTIONS_KEY = 'ServerOptions';
const LOCAL_STORAGE_USERCREDENTIALS_KEY = 'UserCredentials';

class ServerConnection {

  public options?: ServerOptions;
  public credentials?: UserCredentials;

  private webSocket?: WebSocket;
    
  constructor() {}

  loadFromLocalStorage() {
    try {
      const savedOptions = localStorage.getItem(LOCAL_STORAGE_SERVEROPTIONS_KEY);
      const savedCredentials = localStorage.getItem(LOCAL_STORAGE_USERCREDENTIALS_KEY);

      if (savedOptions && savedCredentials) {
        this.options = JSON.parse(savedOptions);
        this.credentials = JSON.parse(savedCredentials);
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  connect() {
    if (!this.options || !this.credentials)
      return;

    this.webSocket?.close();
    this.webSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_PROTOCOL}://${this.options.host}:${this.options.port}/ws/${this.credentials.username}`);

    this.webSocket.onopen = event => {
      
    };
  }
}

interface ServerOptions {
  host: string;
  port: string;
}

interface UserCredentials {
  username: string;
}

const defaultConnection = new ServerConnection();
export const ServerContext = createContext(defaultConnection);

defaultConnection.loadFromLocalStorage();
defaultConnection.connect();