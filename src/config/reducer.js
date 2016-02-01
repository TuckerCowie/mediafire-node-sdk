import {MF_CONFIG_UPDATE} from './actions';

const initialState = {
  id: null,
  key: null,
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
