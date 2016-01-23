'use strict';

class HTTP {

  constructor(url) {
    return {
      GET: args => this.ajax('GET', url, args),
      POST: args => this.ajax('POST', url, args)
    }
  }

  ajax(method, url, args) {
    return new Promise((resolve, reject) => {
      
      let client = new XMLHttpRequest();
      let uri = url;

      if (args && (method === 'POST')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
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

      return promise;

    });
  }

}

export default HTTP;
