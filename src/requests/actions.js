import fetch from 'isomorphic-fetch';
import formUrlEncode from 'form-urlencoded';
import {SHA1} from 'jshashes';

export const MF_RESOURCE_INVALIDATE = 'MF_RESOURCE_INVALIDATE';
export const MF_RESOURCE_REQUEST = 'MF_RESOURCE_REQUEST';
export const MF_RESOURCE_RECEIVE = 'MF_RESOURCE_RECEIVE';
export const MF_RESOURCE_RECEIVE_ERROR = 'MF_RESOURCE_RECEIVE_ERROR';

export function invalidateRequest(method, uri) {
  return {
    type: MF_RESOURCE_INVALIDATE,
    payload: {
      method,
      uri
    }
  };
}

export function requestResource(method, uri, params) {
  return {
    type: MF_RESOURCE_REQUEST,
    payload: {
      method,
      uri,
      params
    }
  };
}

export function receiveResource(method, uri, data) {
  return {
    type: MF_RESOURCE_RECEIVE,
    payload: {
      received: Date.now(),
      method,
      uri,
      data
    }
  };
}

export function receiveResourceError(method, uri, error) {
  return {
    type: MF_RESOURCE_RECEIVE_ERROR,
    payload: {
      received: Date.now(),
      method,
      uri,
      error
    }
  };
}

export function fetchRequest(method, uri, params) {
  return (dispatch, getState) => {
    
    dispatch(requestResource(method, uri, params));

    const state = getState();

    const {
      url,
      version,
      id,
      key,
      responseFormat,
      tokenVersion
    } = state.config;

    const {
      token
    } = state.session;

    const body = {
      application_id: id,
      application_key: key,
      response_format: responseFormat,
      session_token: token,
      token_version: tokenVersion,
      ...params
    };

    if (body[email] && body[password] && body[application_id] && body[application_key]) {
      const {
        email,
        password,
        application_id,
        application_key
      } = body;
      body.signature = SHA1().hex(email + password + application_id + application_key);
    }

    return fetch(url + version + uri, formUrlEncode(body))
      .then(response => response.json())
      .then(data => {
        dispatch(receiveResource(method, uri, data));
      })
      .catch(error => {
        dispatch(receiveResourceError(method, uri, error));
      });
  };
}

function shouldFetchRequest(requests = [], method, uri) {
  
  const request = requests.filter(u => {
    return u === uri && u.hasOwnProperty(method);
  })[0];

  if (!request) {
    return true;
  } else if (request.loading) {
    return false;
  }

  return request.invalid;
}

export function fetchRequestIfNeeded(method, uri, params) {
  return (dispatch, getState) => {
    const {requests} = getState();

    if (shouldFetchRequest(requests, method, uri, params)) {
      return dispatch(fetchRequest(method, uri, params));
    }

    return Promise.resolve();
  };
}
