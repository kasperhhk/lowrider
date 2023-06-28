export const LOGIN_PAGE = '/login';
export const SERVERLIST_PAGE = '/servers';

export function isLoginPage(path: string) {
  return path === LOGIN_PAGE;
}