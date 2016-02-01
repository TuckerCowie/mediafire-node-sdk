import 'babel-core/polyfill';

import configureStore from './store.js';
import {fetchResourceIfNeeded, invalidateResource} from './resources/actions.js';
import {login, createLoginInterval} from './login/actions.js';
import {SHA1} from 'jshashes';
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
   * state will be constructed with basic config.
   *
   * @argument {object} config - Optional overrides for the API Config
   *
   * @example
   * let MF = new MediaFire({id: 12345, key: 'y0ur4pplicationK3y'});
   *
   */
  constructor(config ={}) {

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

  }

  /**
   * Login to MediaFire and obtain a session token. This function also sets the session token into
   * the instance's state store so it can be used later for other requests. Calling this function
   * is required after creating any new instance of MediaFire. Without calling it, you will have to
   * manually pass any required parameters needed into the params object of MediaFire#request.
   *
   * @argument {string} email - Application User's MediaFire Login Email
   * @argument {string} password - Application User's MediaFire Login Password
   * @argument {bool} stayLoggedIn - Determines if the user wishes to stay logged in indefinitely
   *
   * @returns {promise} A promise that resolves with the server's JSON response
   *
   * @example
   * MF.login('email', 'password').then(console.log);
   * @see http://www.mediafire.com/developers/core_api/1.5/user/#get_session_token
   *
   */
  login(email, password, stayLoggedIn) {
    const method = 'get';
    const uri = '/user/get_session_token.php';

    const {
      id,
      key
    } = this._store.getState().config;

    const params = {
      email,
      password,
      signature: new SHA1().hex(email + password + id + key)
    };

    return new Promise((resolve, reject) => {
      this._store.dispatch(fetchResourceIfNeeded(method, uri, params))
        .then(response => {
          this._store.dispatch(login(response.response.session_token, stayLoggedIn));
          resolve(response);
          if (stayLoggedIn) {
            this._store.dispatch(createLoginInterval());
          }
        })
        .catch(reject);
    });

  }

  /**
   * Issue individual API calls to MediaFire. Under the hood, resources are cached in memory by
   * uri by method per instance. Each on of these entities is called a resource. If a duplicate
   * request is made to a previously requested resource and that resource is still valid, a new
   * network request will be avoided. If you need to override the cached version of a resource, you
   * force a new request by passing `false` as the fourth argument.
   *
   * @argument {string} method - HTTP method to use; will get converted to uppercase
   * @argument {string} uri - MediaFire Platform API Endpoint; e.g. '/user/get_session_token.php'
   * @argument {object} params - Key Value store of any optional HTTP query parameters
   * @argument {bool} force - Decide whether or not to forcefully override the current in memory
   * resource by issuing a new request. If true, an MF_RESOURCE_INVALIDATE action will be dispatched
   * with the corresponding resource uri and method before the network request is made. This ensures
   * that a new network request is sent even if a resource is cached locally.
   *
   * @returns {promise} A promise that resolves with a JSON object containing the response
   * data from the request.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Body/json
   *
   * Currently, all responses from the server – including server generated errors – will resolve.
   *
   * @example
   * MF.request('get', '/user/get_info.php').then(console.log);
   * MF.request('post', '/folder/create.php', { foldername: 'New Folder' }).then(console.log);
   * MF.request('get', '/folder/get_info.php', { folder_key: '123abc' }, true).then(console.log);
   *
   */
  request(method, uri, params, force = false) {
    if (force) {
      this._store.dispatch(invalidateResource(method, uri));
    }
    return new Promise((resolve, reject) => {
      this._store.dispatch(fetchResourceIfNeeded(method, uri, params))
        .then(resolve)
        .catch(reject);
    });
  }

}

export default MediaFire;
