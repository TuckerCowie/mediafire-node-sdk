export const MF_GET_RESOURCE = 'MF_GET_RESOURCE';
export const MF_REQUEST_RESOURCE = 'MF_REQUEST_RESOURCE';
export const MF_RECEIVE_RESOURCE = 'MF_RECEIVE_RESOURCE';

export function requestResource(method, uri, params) {
  return {
    type: MF_REQUEST_RESOURCE,
    payload: {
      method,
      uri,
      params
    }
  };
}

export function receiveResource(response) {
  return {
    type: MF_RECEIVE_RESOURCE,
    payload: {
      recieved: Date.now(),
      ...response
    }
  };
}

export function getResource(method, uri, params) {
  return (dispatch, getState) => {    

    // Get the config from the current state
    const {
      apiUrl,
      apiVersion,
      responseFormat,
      tokenVersion
    } = getState().apiConfig;
    
    // Issue the initial request action
    dispatch(requestReource({
      method,
      uri,
      params
    }));

    const configuredParams = {
      ...params,
      response_format: responseFormat,
      token_version: tokenVersion
    };

    // Create the XHR and issue the receive action
    return Http(apiUrl + apiVersion + uri)[method](configuredParams)
      .then(response => dispatch(receiveResource(response)));
  };
}

export function shouldGetResource(state, requestedResource) {

}
