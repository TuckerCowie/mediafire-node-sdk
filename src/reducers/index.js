import {combineReducers} fom 'redux';

import config from './config.js';
import session from './session.js';

const rootReducer = combineReducers({
  config,
  session
});

export default rootReducer;
