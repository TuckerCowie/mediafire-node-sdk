import {
  MF_RESOURCE_INVALIDATE,
  MF_RESOURCE_REQUEST, MF_RESOURCE_RECEIVE, MF_RESOURCE_RECEIVE_ERROR
} from './actions';

const initialRequest = {
  loading: false,
  invalid: false,
  data: {}
};

function request(state = initialRequest, action) {
  switch (action.type) {
    case MF_RESOURCE_INVALIDATE:
      return {
        ...state,
        invalid: true
      };
    case MF_RESOURCE_REQUEST:
      return {
        ...state,
        loading: true,
        invalid: false
      };
    case MF_RESOURCE_RECEIVE:
      return {
        ...state,
        loading: false,
        invalid: false,
        data: action.data,
        lastUpdated: action.recieved
      };
    case MF_RESOURCE_RECEIVE_ERROR:
      return {
        ...state,
        loading: false,
        invalid: false,
        data: action.error,
        lastUpdated: action.recieved
      };
    default:
      return state;
  }
}

const initialResource = {};

function resourcesByRequest(state = initialResource, action) {
  switch (action.type) {
    case MF_RESOURCE_INVALIDATE:
    case MF_RESOURCE_REQUEST:
    case MF_RESOURCE_RECEIVE:
    case MF_RESOURCE_RECEIVE_ERROR:
      return {
        ...state,
        [action.payload.uri]: {
          ...state[action.payload.uri],
          [action.payload.method]: request(state[action.payload.uri][action.payload.method] || {}, action.payload)
        }
      };
    default:
      return state;
  }
}

export default resourcesByRequest;
