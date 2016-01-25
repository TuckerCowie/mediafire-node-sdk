'use strict';

import FormEncode from 'form-urlencoded';
import {HTTP} from './http';
import Session from './session';
import {SHA1} from 'jshashes';
import Validate from 'validate.js';
import ValidationError from './validationError';

/**
 * @constant {string} API_URL
 */
const API_URL = 'https://www.mediafire.com/api/';

/**
 * Holds the default API settings for all instances
 * @private
 * @property {string} apiVersion - Platform API version to use
 * @property {string} appId - Individual Application Identifier
 * @property {string} appKey - Individual Application Key
 * @property {string} responseFormat - Content Return type (`json` or `xml`)
 */
const defaultConfig = {
  apiVersion: '1.4',
  appId: null,
  appKey: null,
  responseFormat: 'json'
};

/** MediaFire API Wrapper */
class MediaFire {
  
  /** Get the validation constraints for making API calls
   * @private
   * @returns {object}
   */
  _getConstraints() {
    return {
      config: {
        appId: {
          presence: true
        },
        appKey: {
          presence: true
        }
      }
    };
  }

  /** Login to MediaFire and create session for API calls
   * @argument {string} email - User's Email Address
   * @argument {string} password - User's Email Password
   * @argument {object} config - API Config
   */
  constructor(email, password, config) {

    let error = Validate(config, this._getConstraints().config);

    if (error) throw new ValidationError(error);

    /** Hold the API settings for this instance
     * @private
     */
    this._config = {
      ...defaultConfig,
      ...config
    };

    this.login({email, password});

  }

  /** Wrap the HTTP module
   * @returns {promise}
   * @argument {string} method - HTTP method to use (`GET` or `POST`)
   * @argument {string} uri - API Path to call with a leading slash,
   * not including the Platform API version number
   */
  api(method, uri, params) {
    const configParams = Object.assign({}, params, {
      response_format: this._config.responseFormat
    });
    return HTTP(API_URL + _config.apiVersion + uri)[method](params);
  }

  /** Login and set session token
   * @returns {promise}
   * @argument {object} credentials - User Email and Password to use
   * when retieving a session token
   */
  login(credentials) {
    
    let error = Validate(credentials, this._getConstraints().config);

    if (error) throw new ValidationError(error);

    const url = '/user/get_session_token.php';

    const params = {
      application_id: _config.appId,
      email: credentials.email,
      password: credentials.password,
      signature: new SHA1().digestFromString(credentials.email + credentials.password + _config.appId + _config.appKey)
    };

    const response = this.api('GET', url, params);

    return response.then(data => {
      /** Hold the Session for this instance
       * @private
       */
      this._session = new Session(data.session_token);
      return data;
    });;

  }

  /** Get user information
   * @returns {promise}
   */
  getUserInfo() {

    const url = '/user/get_info.php';

    const params = {
      session_token: this._session.getToken(),
    };

    const response = this.api('POST', url, params);

    return response;

  }

  /** Retreive the contents of a folder
   * @returns {promise}
   * @argument {string} folderKey - Unique Folder Identifier  
   * @argument {string} chunk
   */
  getFolder(folderKey, chunk) {

    const url = '/folder/get_content.php';

    const params = {
      session_token: this._session.getToken(),
      folder_key: folderKey,
      content_type: 'folder',
      chunk
    };

    const response = this.api('GET', url, params);

    return response;

  }

  /** Retreive the links for a given file
   * @returns {promise}
   */
  getFileLinks(fileId) {

    const url = '/file/get_links.php';

    // TODO: Make sure correct params are passed into function
    const params = {
      session_token: this._session.getToken(),
      quick_key: fileId
    };

    const response = this.api('GET', url, params);

    return response;

  }

}

export default MediaFire;
