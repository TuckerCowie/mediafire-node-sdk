export const MF_LOGIN_INTERVAL_CLEAR = 'MF_LOGIN_INTERVAL_CLEAR';
export const MF_LOGIN_INTERVAL_CREATE = 'MF_LOGIN_INTERVAL_CREATE';
export const MF_LOGIN = 'MF_LOGIN';

export function clearLoginInterval() {
  return {
    type: MF_LOGIN_INTERVAL_CLEAR
  };
}

export function createLoginInterval(interval) {
  return {
    type: MF_LOGIN_INTERVAL_CREATE,
    payload: interval
  };
}

export function login(token) {
  return {
    type: MF_LOGIN,
    payload: token
  };
}
