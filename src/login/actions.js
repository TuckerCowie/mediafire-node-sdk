import {fetchResource} from '../resources/actions';

export const MF_LOGIN = 'MF_LOGIN';
export const MF_LOGIN_RENEW = 'MF_LOGIN_RENEW';

export function createLoginTimeout(dispatcher, interval, actionCreator) {
  return setTimeout(dispatcher, interval, actionCreator);
}

export function renewLogin(token, interval = 57000) {
  return dispatch => {
    createLoginTimeout(dispatch, interval, renewLogin(token, interval));
    return dispatch({
      type: MF_LOGIN_RENEW,
      payload: {
        token,
        interval,
        stayLoggedIn: true
      }
    });
  };
}

export function login(token, stayLoggedIn = false, interval) {
  return dispatch => {
    if (stayLoggedIn) {
      dispatch(renewLogin(token, interval));
    }
    return dispatch({
      type: MF_LOGIN,
      payload: {
        token,
        stayLoggedIn
      }
    });
  }
}
