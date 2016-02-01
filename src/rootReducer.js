import {combineReducers} from 'redux';

import config from './config/reducer.js';
import resources from './resources/reducer.js';
import login from './login/reducer.js';

const rootReducer = combineReducers({
  config,
  resources,
  login
});

export default rootReducer;
