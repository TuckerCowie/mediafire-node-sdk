import {getResource} from './resource';
import {SHA1} from 'jshashes';

export const MF_LOGIN = 'MF_LOGIN';
export const MF_CREATE_LOGIN_INTERVAL = 'MF_CREATE_LOGIN_INTERVAL';
export const MF_CLEAR_LOGIN_INTERVAL = 'MF_CLEAR_LOGIN_INTERVAL';

function createLoginInterval(interval) {
  return {
    type: MF_CREATE_LOGIN_INTERVAL,
    payload: interval
  };
}

function clearLoginInterval(interval) {
  return {
    type: MF_CLEAR_LOGIN_INTERVAL
  };
}

function getSessionToken(params) {
  return dispatch(getResource('GET', '/user/get_session_token.php', params));
}

export function login(credentials, autoRefresh) {
  return (dispatch, getState) => {    

    const {appId, appKey} = getState().apiConfig;

    const params = {
      application_id: appId,
      email: credentials.email,
      password: credentials.password,
      signature: new SHA1().digestFromString(credentials.email + credentials.password + appId + appKey)
    };

    const response = getSessionToken(params);

    if (autoRefresh) {
      dispatch(createLoginInterval(setInterval(getSessionToken, 570000, params)));
    }

    // Create the XHR and issue the receive action
    return response;

  };
}