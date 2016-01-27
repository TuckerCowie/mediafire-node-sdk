import fetch from 'isomorphic-fetch';
import formUrlEncode from 'form-urlencoded';

export const MF_RECEIVE_RESOURCE = 'MF_RECEIVE_RESOURCE';
export const MF_RECEIVE_RESOURCE_ERROR = 'MF_RECEIVE_RESOURCE_ERROR';
export const MF_REQUEST_RESOURCE = 'MF_REQUEST_RESOURCE';

export function getResource(method, uri, params) {
  return (dispatch, getState) => {    
    
    // Issue the initial request action
    dispatch(requestResource(method, uri, params));

    // Get the config from the current state
    const {
      apiUrl,
      apiVersion,
      responseFormat,
      tokenVersion
    } = getState().apiConfig;

    const body = {
      ...params,
      response_format: responseFormat,
      token_version: tokenVersion
    };

    const resource = new Request(apiUrl + apiVersion + uri);

    return fetch(resource, {method, body: formUrlEncode(body)})
      .then(response => dispatch(receiveResource(response)))
      .catch(error => dispatch(receiveResourceError(error, {method, uri, configuredParams})));

  };

}

export function receiveResource(response) {
  return {
    type: MF_RECEIVE_RESOURCE,
    payload: {
      isLoading: false,
      ...response.body
    },
    meta: {
      response
    }
  };
}

export function receiveResourceError(error, request) {
  return {
    type: MF_RECEIVE_RESOURCE_ERROR,
    payload: {
      isLoading: false,
      error
    },
    meta: {
      request
    }
  };
}

export function requestResource(method, uri, params) {
  return {
    type: MF_REQUEST_RESOURCE,
    payload: {
      isLoading: true,
      request: {
        method,
        uri,
        params
      }
    }
  };
}
