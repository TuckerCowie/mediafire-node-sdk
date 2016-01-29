import {MF_CONFIG_UPDATE} from './actions';

const initialState = {
  debug: false,
  id: null,
  key: null,
  responseFormat: 'json',
  tokenVersion: 1,
  url: 'https://www.mediafire.com/api/',
  version: '1.5'
};

function config(state = initialState, action) {
  switch (action.type) {
    case MF_CONFIG_UPDATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export default config;
