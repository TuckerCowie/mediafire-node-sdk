'use strict';

/**
 * Simple HTTP Adapter
 */
class HTTP {

  /**
   * Get available HTTP methods
   * @returns {object}
   * @argument {string} url - Fully qualified url
   */
  constructor(url) {
    return {
      GET: params => this.ajax('GET', url, params),
      POST: params => this.ajax('POST', url, params)
    }
  }

  /**
   * Create an XMLHttpRequest
   * @returns {promise}
   * @argument {string} method - HTTP method to use
   * @argument {string} url - Fully qualified url
   * @argument {object} params - Key Value store of any HTTP query parameters to be sent with the request
   */
  ajax(method, url, params) {
    return new Promise((resolve, reject) => {
      
      let client = new XMLHttpRequest();
      let uri = url;

      if (params && (method === 'POST')) {
        uri += '?';
        var paramCount = 0;
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            if (paramCount++) {
              uri += '&';
            }
            uri += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
          }
        }
      }

      client.open(method, uri);
      client.send();

      client.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.response);
        } else {
          reject(this.statusText);
        }
      };

      client.onerror = function () {
        reject(this.statusText);
      };

    });
  }

}

export default HTTP;
