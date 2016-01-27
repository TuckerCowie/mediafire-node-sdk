import {getResource} from './resource';
import Hashes from 'jshashes';

export const MF_CLEAR_LOGIN_INTERVAL = 'MF_CLEAR_LOGIN_INTERVAL';
export const MF_CREATE_LOGIN_INTERVAL = 'MF_CREATE_LOGIN_INTERVAL';
export const MF_LOGIN = 'MF_LOGIN';

export function clearLoginInterval() {
  return {
    type: MF_CLEAR_LOGIN_INTERVAL
  };
}

export function createLoginInterval(interval) {
  return {
    type: MF_CREATE_LOGIN_INTERVAL,
    payload: interval
  };
}

export function login(token) {
  return {
    type: MF_LOGIN,
    payload: token
  };
}

export function getSessionToken(params) {
  return dispatch => {
    return dispatch(getResource('GET', '/user/get_session_token.php', params));
  };
}

export function getLogin(credentials, autoRefresh) {
  return (dispatch, getState) => {

    const {appId, appKey} = getState().apiConfig;

    let SHA1 = new Hashes.SHA1;

    const params = {
      application_id: appId,
      email: credentials.email,
      password: credentials.password,
      signature: SHA1.hex(credentials.email + credentials.password + appId + appKey)
    };

    return getSessionToken(params)
      .then(action => {
        if (autoRefresh) {
          dispatch(createLoginInterval(setInterval(getSessionToken, 570000, params)));
        }
        return dispatch(login(action.payload.response.session_token));
      });

  };
}
