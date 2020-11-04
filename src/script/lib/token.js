const tokenKey = 'token';
const usernameKey = 'username';

export function getToken() {
  return sessionStorage.getItem(tokenKey);
}

export function getUsername() {
  return sessionStorage.getItem(usernameKey);
}

export function setToken(token) {
  sessionStorage.setItem(tokenKey, token);
}

export function setUsername(username) {
  sessionStorage.setItem(usernameKey, username);
}

export function removeToken() {
  sessionStorage.removeItem(tokenKey);
}

export function removeUsername() {
  sessionStorage.removeItem(usernameKey);
}