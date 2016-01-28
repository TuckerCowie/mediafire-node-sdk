'use strict';

import {MF_CONFIG_UPDATE} from '../actions/config';

/**
 * Holds the default API settings for all instances
 * @private
 * @property {string} url - Platform URL
 * @property {string} version - Platform API version
 * @property {string} appId - Individual Application Identifier
 * @property {string} appKey - Individual Application Key
 * @property {string} responseFormat - Content Return type (`json` or `xml`)
 * @property {int} tokenVersion - MediaFire Token version
 */
const initialState = {
  url: 'https://www.mediafire.com/api/',
  version: '1.5',
  id: null,
  key: null,
  debug: false,
  responseFormat: 'json'
  tokenVersion: 1
};

function config(state = initialState, action) {
  switch (action.type) {
    case MF_CONFIG_UPDATE:
      return action.payload;
    default:
      return state;
  }
}

export default config;
