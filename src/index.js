import configureStore from './store.js';
import promisifyAction from './lib/promisifyAction.js';
import Validate from 'validate.js';
import ValidationError from './lib/validationError.js';

import {updateApiConfig} from './actions/apiConfig.js'
import {getResource} from './actions/resource.js'
import {login} from './actions/session.js'

/**
 * Holds the default API settings for all instances
 * @private
 * @property {string} apiUrl - Platform URL
 * @property {string} apiVersion - Platform API version
 * @property {string} appId - Individual Application Identifier
 * @property {string} appKey - Individual Application Key
 * @property {string} responseFormat - Content Return type (`json` or `xml`)
 * @property {int} tokenVersion - MediaFire Token version
 */
const defaultConfig = {
  apiUrl: 'https://www.mediafire.com/api/',
  apiVersion: '1.5',
  appId: null,
  appKey: null,
  debug: false,
  responseFormat: 'json'
  tokenVersion: 1
};

/** Validation constraints for making API calls
 * @private
 */
const validationConstraints = {
  config: {
    appId: {
      presence: true
    },
    appKey: {
      presence: true
    }
  }
};

/** MediaFire API Wrapper */
class MediaFire {

  /** Issue individual API calls
   * @returns {promise}
   * @argument {string} method - HTTP method to use
   * @argument {string} url - Fully qualified url
   * @argument {object} params - Key Value store of any HTTP query parameters to be sent with the request
   */
  static api(method, uri, params) {
    return promisifyAction(getResource)(method, uri, params);
  }

  /** Create a session store for API calls using this instance
   * @argument {string} email - User's Email Address
   * @argument {string} password - User's Email Password
   * @argument {object} config - API Config
   */
  constructor(config) {

    /** State store for this instance
     * @private
     */
    this._store = configureStore({
      apiConfig: defaultConfig
    });

    let error = Validate(config, validationConstraints.config);
    if (error) throw new ValidationError(error);

    updateApiConfig(config);

  }

  /** Login to MediaFire to obtain a session token
   * @returns {promise}
   * @argument {string} email - User's Email Address
   * @argument {string} password - User's Email Password
   * @argument {boolean} autoRefresh - A flag to set whether or not the session token should be refreshed before it expires
   */
  login(email, password, autoRefresh = true) {
    return promisifyAction(login)({email, password}, autoRefresh);
  }

}
