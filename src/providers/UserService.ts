import { ISSERVER } from '../utils';

export interface User {
  username: string;
}

const localStorageKey = "User";
function getInitialState(): User | null {
  if (ISSERVER)
    return null;

  const user = localStorage.getItem(localStorageKey);
  return user ? JSON.parse(user) : null;
}

export const userService = {
  user: getInitialState(),
  login: function (username: string) {
    this.user = { username };
    localStorage.setItem(localStorageKey, JSON.stringify(this.user));
  },
  logout: function () {
    this.user = null;
    localStorage.removeItem(localStorageKey);
  }
}