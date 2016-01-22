'use strict';

import SHA1 from './SHA1';

const defaultConfig = {
  apiVersion: '1.5',
  appId: null,
  appKey: null,
  tokenVersion: 2,
  v2tokensStored: 3
};

let _config = null;
let _sessionToken = null;
let _v2SessionTokens = [];

class MediaFire {

  constructor(options) {
    _config = {
      ...defaultConfig,
      ...options
    };
  }

  login(email, password, callback) {
    const credentials = {
      email,
      password,
      application_id: _config.appId,
      signature: new SHA1().digestFromString(email + password + _config.appId + _config.appKey)
    };
  }

}

export default MediaFire;

