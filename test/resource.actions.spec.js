import configureMockStore from 'redux-mock-store';
import expect from 'expect';
import thunk from 'redux-thunk';
import {MF_RECEIVE_RESOURCE, MF_RECEIVE_RESOURCE_ERROR, MF_REQUEST_RESOURCE} from '../src/actions/resource';
import {getResource, receiveResource, receiveResourceError, requestResource} from '../src/actions/resource';
import * as mock from './helpers/mockData.js';

describe('Resource Action Creators (Asynchronous)', () => {

  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);

  describe('getResource', () =>{

    it('should exist', () => {
      expect(getResource)
        .toExist()
        .toBeA('function');
      expect(getResource(mock.request.method, mock.request.uri, mock.request.params))
        .toBeA('function');
    });

    it('dispatches MF_REQUEST_RESOURCE & MF_REQUEST_RESOURCE when successful', done => {

      const expectedActions = [
       {
          type: MF_REQUEST_RESOURCE,
          payload: {
            isLoading: true,
            request: mock.request
          }
        },
        {
          type: MF_RECEIVE_RESOURCE,
          payload: {
            isLoading: false,
            ...mock.response.body
          },
          meta: {
            response: {
              ...mock.response
            }
          }
        }
      ];

      const store = mockStore(mock.state, expectedActions, done);
      store.dispatch(getResource(mock.request.method, mock.request.uri, mock.request.params));

    });

  });

});

describe('Resource Action Creators (Synchronous)', () => {
  
  describe('receiveResource', () =>{

    it('should exist', () => {
      expect(receiveResource)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {
      
      const response = {
        data: {
          someInformation: '1234567890'
        }
      };

      expect(receiveResource(response))
        .toBeA('object')
        .toEqual({
          type: MF_RECEIVE_RESOURCE,
          payload: {
            isLoading: false,
            ...response.body
          },
          meta: {
            response
          }
        });

    });

  });

  describe('receiveResourceError', () =>{

    it('should exist', () => {
      expect(receiveResourceError)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {
      
      const error = {code: 401, message: 'Unaothorized'};
      const request = {method: 'GET', uri: '/api/url', params: {q: 'search'}};
      
      expect(receiveResourceError(error, request))
        .toBeA('object')
        .toEqual({
          type: MF_RECEIVE_RESOURCE_ERROR,
          payload: {
            isLoading: false,
            error
          },
          meta: {
            request
          }
        });

    });

  });

  describe('requestResource', () =>{

    it('should exist', () => {
      expect(requestResource)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {

      const method = 'GET';
      const uri = '/api/url';
      const params = {some: 'param'};

      expect(requestResource(method, uri, params))
        .toBeA('object')
        .toEqual({
          type: MF_REQUEST_RESOURCE,
          payload: {
            isLoading: true,
            request: {
              method,
              uri,
              params
            }
          }
        });
    });


  });

});