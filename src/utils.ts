import { ServerDefinition } from './providers/ServerListProvider';
import { User } from './providers/UserService';

export const ISSERVER = typeof window === "undefined";

export function WEBSOCKET_URL(server: ServerDefinition, user: User) {
  return `${process.env.NEXT_PUBLIC_WS_PROTOCOL}://${server.host}/ws/${user.username}`;
}