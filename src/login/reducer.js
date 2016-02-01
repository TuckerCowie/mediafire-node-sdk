import {MF_LOGIN, MF_LOGIN_RENEW} from './actions';

const initialState = {
  token: null,
  stayLoggedIn: false
};

function login(state = initialState, action) {
  switch (action.type) {
    case MF_LOGIN:
    case MF_LOGIN_RENEW:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export default login;
