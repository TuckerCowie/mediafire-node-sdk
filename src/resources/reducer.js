import {
  MF_RESOURCE_INVALIDATE,
  MF_RESOURCE_REQUEST, MF_RESOURCE_RECEIVE, MF_RESOURCE_RECEIVE_ERROR
} from './actions';
import {getCurrentResource} from './actions';

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
        error: false,
        response: action.payload.response,
        lastUpdated: action.payload.recieved
      };
    case MF_RESOURCE_RECEIVE_ERROR:
      return {
        ...state,
        loading: false,
        invalid: false,
        error: action.payload.error,
        lastUpdated: action.payload.recieved
      };
    default:
      return state;
  }
}

function resources(state = {}, action) {
  switch (action.type) {
    case MF_RESOURCE_INVALIDATE:
    case MF_RESOURCE_REQUEST:
    case MF_RESOURCE_RECEIVE:
    case MF_RESOURCE_RECEIVE_ERROR:
      const {
        method,
        uri
      } = action.payload;
      return {
        ...state,
        [uri]: {
          ...state[uri],
          [method]: request(getCurrentResource(state, uri, method), action)
        }
      };
    default:
      return state;
  }
}

export default resources;
