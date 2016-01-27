'use strict';

import {MF_UPDATE_API_CONFIG} from '../actions/apiConfig';

function apiConfig(state, action) {
  switch (action.type) {
    case MF_UPDATE_API_CONFIG:
      return action.payload;
    default:
      return state;
  }
}

export default session;
