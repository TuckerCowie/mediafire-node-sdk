import {MF_LOGIN, MF_LOGIN_CREATE_INTERVAL} from './actions';

const initialState = {
  token: null,
  stayLoggedIn: false
};

function login(state = initialState, action) {
  switch (action.type) {
    case MF_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        stayLoggedIn: action.payload.stayLoggedIn
      };
    case MF_LOGIN_CREATE_INTERVAL:
      return {
        ...state,
        interval: action.payload
      };
    default:
      return state;
  }
}

export default login;
