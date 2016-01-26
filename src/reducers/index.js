import {combineReducers} fom 'redux';
import apiConfig from './apiConfig.js';
import resource from './resource.js';
import session from './session.js';

const rootReducer = combineReducers({
  apiConfig,
  lastRequestedResource: resource,
  session
});

export default rootReducer;
