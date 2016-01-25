'use strict';

/** Stores the session token */
class Session {
  /** Set the session token
   * @argument {string} token - Session Token created when logging in
   */
  constructor(token) {
    /** MediaFire Session Token
     * @private
     */
    this._token = token;
  }

  /** Get the session token
   * @returns {string} Session Token
   */
  getToken() {
    return this._token;
  }
}

export default Session;
