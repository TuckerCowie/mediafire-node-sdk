'use strict';

import {MF_LOGIN, MF_LOGIN_INTERVAL_CLEAR, MF_LOGIN_INTERVAL_CREATE} from '../actions/session';

const initialState = {
  token: null,
  interval: null
};

function session(state = initialState, action) {
  switch (action.type) {
    case MF_LOGIN:
      return {
        ...state,
        token: action.payload;
      };
    case MF_LOGIN_INTERVAL_CREATE:
      return {
        ...state,
        interval: action.payload
      };
    case MF_LOGIN_INTERVAL_CLEAR:
      state.interval();
      return {
        ...state,
        interval: null
      };
    default:
      return state;
  }
}

export default session;
