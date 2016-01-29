import {combineReducers} from 'redux';

import config from './config/reducer.js';
import resourcesByRequest from './requests/reducer.js';
import session from './session/reducer.js';

const rootReducer = combineReducers({
  config,
  resourcesByRequest,
  session
});

export default rootReducer;
