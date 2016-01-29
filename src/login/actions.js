import {fetchResource} from '../resources/actions';

export const MF_LOGIN = 'MF_LOGIN';
export const MF_LOGIN_CREATE_INTERVAL = 'MF_LOGIN_CREATE_INTERVAL';

function renewLogin() {
  return dispatch => {
    dispatch(fetchResource('get', '/user/renew_session_token.php'))
      .then(response => {
        response.json().then(data => {
          dispatch(login(data.response.session_token, true));
        });
      });
  };
}

export function createLoginInterval(interval = 57000) {
  return (dispatch) => dispatch({
    type: MF_LOGIN_CREATE_INTERVAL,
    payload: setTimeout(dispatch, interval, renewLogin())
  });
}

export function login(token, stayLoggedIn) {
  return {
    type: MF_LOGIN,
    payload: {
      token,
      stayLoggedIn
    }
  };
}
