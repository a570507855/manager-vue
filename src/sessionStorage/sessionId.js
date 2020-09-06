const sessionIdKey = 'sessionId'

export function getSessionId() {
  return sessionStorage.getItem(sessionIdKey);
}

export function setSessionId(sessionId) {
  sessionStorage.setItem(sessionIdKey, sessionId);
}

export function removeSessionId() {
  sessionStorage.removeItem(sessionIdKey);
}
