import configureStore from './store.js';
import fetch from 'isomorphic-fetch';
import formUrlEncode from 'form-urlencoded';
import {login} from './actions/session.js';
import {updateConfig} from './actions/config.js';
import Validate from 'validate.js';
import ValidationError from './lib/ValidationError.js';

/** Validation constraints for making API calls
 * @private
 */
const validationConstraints = {
  config: {
    id: {
      presence: true
    },
    key: {
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
  request(method, uri, params) {

    const {
      url,
      version,
      responseFormat,
      tokenVersion
    } = this._store.getState().config;

    const {
      token
    } = this._store.getState().session;

    const body = {
      session_token: token,
      response_format: responseFormat,
      token_version: tokenVersion,
      ...params
    };

    const request = new Request(url + version + uri);

    return fetch(request, {method: method.toUpperCase(), body: formUrlEncode(body)});

  }

  /** Create a session store for API calls using this instance
   * @argument {string} email - User's Email Address
   * @argument {string} password - User's Email Password
   * @argument {object} config - API Config
   */
  constructor(email, password, config) {

    /** State store for this instance
     * @private
     */
    this._store = configureStore();

    const error = Validate(config, validationConstraints.config);
    if (error) throw new ValidationError(error);

    updateConfig(config);

  }

}
