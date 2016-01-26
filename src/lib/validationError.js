'use strict';

/**
 * @private
 */
class ValidationError {

  constructor(message) {
    this.message = message;
    this.name = 'MediaFire API Validation Error';
  }

}

export default ValidationError;
