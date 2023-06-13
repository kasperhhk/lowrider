import { createContext, PropsWithChildren, useState } from 'react';
import { User, userService } from './UserService';

export const UserContext = createContext<User>({} as any);

export function UserProvider({ children }: PropsWithChildren) {
  const [user] = useState(userService.user);

  return (user &&
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}