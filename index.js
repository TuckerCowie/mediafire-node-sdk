'use strict';

import {HTTP} from './http';
import {SHA1} from 'jshashes';
import FormEncode from 'form-urlencoded';

const API_URL = 'https://www.mediafire.com/api/';

const defaultConfig = {
  apiVersion: '1.4',
  appId: null,
  appKey: null,
};

let _config = null;
let _sessionToken = null;

class MediaFire {

  // Sets the default configuration for the session.
  // Returns MediaFire
  constructor(options) {
    _config = {
      ...defaultConfig,
      ...options
    };
  }

  // Wraps the HTTP module
  // Returns promise
  api(method, uri, params) {
    return HTTP(API_URL + _config.apiVersion + uri)[method](params);
  }

  // 
  // API Helper Methods
  // 

  // Login and set session token
  // Returns promise
  login(email, password) {
    
    const url = '/user/get_session_token.php';

    const params = {
      application_id: _config.appId,
      email,
      password,
      response_format: 'json',
      signature: new SHA1().digestFromString(email + password + _config.appId + _config.appKey)
    };

    const response = this.api('GET', url, params);

    return response.then(data => {
      this.setSessionToken(data.session_token);
      return data;
    });;

  }

  // Set the session token
  // Returns null
  setSessionToken(token) {
    _sessionToken = token;
  }

  // Get the session token
  // Returns string
  getSessionToken() {
    return _sessionToken;
  }

  // Get user information
  // Returns promise
  getUserInfo() {

    const url = '/user/get_info.php';

    const params = {
      session_token: _sessionToken,
      response_format: 'json'
    };

    const response = this.api('POST', url, params);

    return response;

  }

  // Retreive the contents of a folder
  // Returns promise
  getFolder(folderKey, contentType, chunk) {

    const url = '/folder/get_content.php';

    const params = {
      session_token: _sessionToken,
      folder_key: folderKey,
      content_type: contentType,
      chunk,
      response_format: 'json'
    };

    const response = this.api('GET', url, params);

    return response;

  }

  // Retreive the links for a given file
  // Returns promise
  getFileLinks(fileId) {

    const url = '/file/get_links.php';

    // TODO: Make sure correct params are passed into function
    const params = {
      session_token: _sessionToken,
      quick_key: fileId,
      response_format: 'json'
    };

    const response = this.api('GET', url, params);

    return response;

  }

}

export default MediaFire;
