import Hashes from 'jshashes';

let SHA1 = new Hashes.SHA1;

const email = 'john.doe@email.com'
const password = 'allyourbasearebelongtous'

export const state = {
  config: {
    url: 'https://www.mediafire.com/api/',
    version: '1.5',
    id: 0,
    key: '15dsaf15dfa230fAkeK3y1234567890',
    responseFormat: 'json',
    tokenversion: 1,
    debug: true
  }
};

export const request = {
  method: 'GET',
  uri: '/user/get_session_token.php',
  params: {
    application_id: state.config.id,
    email,
    password,
    signature: SHA1.hex(email + password + state.config.id + state.config.key)
  }
}

export const response = {
  body: {
    response: {
      session_token: '1234567890abcdefghijk'
    }
  }
};

export const error = {
  body: {
    response: {
      status: 404
    }
  }
};