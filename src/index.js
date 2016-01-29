import 'babel-core/polyfill';

import configureStore from './store.js';
import {fetchRequestIfNeeded, invalidateRequest} from './requests/actions.js';
import {updateConfig} from './config/actions.js';
import Validate from 'validate.js';
import ValidationError from './lib/ValidationError.js';

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

  /**
   * Creates a stateful store of API calls using a given user account. Once invoked, the initial
   * state will be constructed and a login request will be dispatched to obtain the first session
   * token. This function is synchronous in order to ensure any additional calls made to the API
   * are invoked with the correct config and a valid session token.
   *
   * @argument {string} email - User's Email Address
   * @argument {string} password - User's Email Password
   * @argument {object} config - API Config
   *
   */
  constructor(email, password, config) {

    const error = Validate(config, validationConstraints.config);
    if (error) {
      throw new ValidationError(error);
    }

    /** State store for this instance
     * @private
     * @see http://rackt.org/redux/docs/api/Store.html
     */
    this._store = configureStore();

    this._store.dispatch(updateConfig(config));

    this._login(email, password);

  }

  /**
   * Login to MediaFire and obtain a session token.
   * @private
   *
   * @argument {string} email - Application User's MediaFire Login Email
   * @argument {string} password - Application User's MediaFire Login Password
   *
   * @returns {object} Response body
   */
  _login(email, password) {
    const method = 'post';
    const uri = '/user/get_session_token.php';
    const params = {
      email,
      password
    };

    this._store.dispatch(fetchRequestIfNeeded(method, uri, params)).then(action => {
      console.log(action);
    });

  }

  /** 
   * Issue individual API calls to MediaFire. Under the hood, requests are cached in memory by 
   * uri by method. If a duplicate request is made to a previously requested resource and that  
   * resource is still valid, a network request will be avoided.
   *
   * @argument {string} method - HTTP method to use; will get converted to uppercase
   * @argument {string} uri - MediaFire Platform API Endpoint; e.g. '/user/get_session_token.php'
   * @argument {object} params - Key Value store of any optional HTTP query parameters
   * @argument {bool} force - Decide whether or not to forcefully override the current in memory
   * version of requested resource. If true, an MF_RESOURCE_INVALIDATE action will be dispatched
   * with the corresponding request uri and method before the network fetch is made to invalidate
   * that resource. This ensures that a new network request is sent even if a resource is cached.
   *
   * @returns {promise} A promise that resolves with the body of the response from the requested
   * resource. If the promise cannot resolve and catches an error, the entire error will bubble up.
   */
  request(method, uri, params, force = false) {
    if (force) {
      this._store.dispatch(invalidateRequest(method, uri));
    }
    return new Promise((resolve, reject) => {
      this._store.dispatch(fetchRequestIfNeeded(method, uri, params))
        .then(() => {
          const resource = this._store.getState().resourcesByRequest[uri][method];
          console.log(`Got requested resource: ${uri}`, resource);
          resolve(resource);
        })
        .catch(error => {
          console.log(`Could not fetch resource: ${uri}`, error);
          reject(error);
        });
    });
  }

}

export default MediaFire;
