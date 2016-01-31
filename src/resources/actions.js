import fetch from 'isomorphic-fetch';
import formUrlEncode from 'form-urlencoded';

export const MF_RESOURCE_INVALIDATE = 'MF_RESOURCE_INVALIDATE';
export const MF_RESOURCE_REQUEST = 'MF_RESOURCE_REQUEST';
export const MF_RESOURCE_RECEIVE = 'MF_RESOURCE_RECEIVE';
export const MF_RESOURCE_RECEIVE_ERROR = 'MF_RESOURCE_RECEIVE_ERROR';

export function invalidateResource(method, uri) {
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

export function receiveResource(method, uri, response) {
  return {
    type: MF_RESOURCE_RECEIVE,
    payload: {
      received: Date.now(),
      method,
      uri,
      response
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

export function fetchResource(method, uri, params) {
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
    } = state.login;

    const query = formUrlEncode({
      application_id: id,
      application_key: key,
      response_format: responseFormat,
      session_token: token,
      token_version: tokenVersion,
      ...params
    });

    const config = {
      method: method.toUpperCase()
    };

    /** @TODO Ensure that for future versions of platform, API use request.body instead of query
     * parameters. This will allow safer transport of our user's private credentials.
     */
    const request = new Request(`${url + version + uri}?${query}`, config);

    return fetch(request, config)
      .then(response => dispatch(receiveResource(method, uri, response)).payload.response)
      .catch(error => {
        dispatch(receiveResourceError(method, uri, error));
      });
  };
}

export function getCurrentResource(resources, uri, method) {
  if (resources.hasOwnProperty(uri)) {
    if (resources[uri].hasOwnProperty(method)) {
      return resources[uri][method];
    }
  }
  return undefined;
}

export function shouldFetchResource(resource) {
  /** @TODO Also check for if params have changed since last request */
  if (!resource) {
    return true;
  } else if (resource.loading) {
    return false;
  }
  return resource.invalid;
}

export function fetchResourceIfNeeded(method, uri, params) {
  return (dispatch, getState) => {
    const resource = getCurrentResource(getState().resources, uri, method);
    if (shouldFetchResource(resource)) {
      return dispatch(fetchResource(method, uri, params));
    }
    return Promise.resolve(resource.response);
  };
}
