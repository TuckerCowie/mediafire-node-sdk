export const state = {
  apiConfig: {
    apiUrl: 'https://www.mediafire.com/api/',
    apiVersion: '1.5',
    response_Format: 'json',
    token_version: 1,
    debug: true
  }
};

export const request = {
  method: 'GET',
  uri: '/user/get_session_token.php',
  params: {
    application_id: 1,
    email: 'john.doe@email.com',
    password: 'allyourbasearebelongtous',
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