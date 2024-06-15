// inject username and pass to url
export function injectAuth(url: string, username: string, password: string) {
  const parsed = new URL(url);
  parsed.username = username;
  parsed.password = password;
  return parsed.toString();
}
