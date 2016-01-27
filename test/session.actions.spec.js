import configureMockStore from 'redux-mock-store';
import expect from 'expect';
import thunk from 'redux-thunk';
import {MF_RECEIVE_RESOURCE, MF_RECEIVE_RESOURCE_ERROR, MF_REQUEST_RESOURCE} from '../src/actions/resource';
import {MF_LOGIN, MF_CREATE_LOGIN_INTERVAL, MF_CLEAR_LOGIN_INTERVAL} from '../src/actions/session';
import {createLoginInterval, clearLoginInterval, login, getLogin} from '../src/actions/session';
import * as mock from './helpers/mockData.js';

describe.only('Session Action Creators (Asynchronous)', () => {

  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);

  describe('getLogin', () =>{

    it('should exist', () => {
      expect(getLogin)
        .toExist()
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
      store.dispatch(getLogin(mock.request.method, mock.request.uri, mock.request.params));

    });

  });

});

describe('Session Action Creators (Synchronous)', () => {

  describe('createLoginInterval', () =>{

    it('should exist', () => {
      expect(createLoginInterval)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {
      const interval = 'interval';
      expect(createLoginInterval(interval))
        .toBeA('object')
        .toEqual({
          type: MF_CREATE_LOGIN_INTERVAL,
          payload: interval
        });
    });

  });

  describe('clearLoginInterval', () =>{

    it('should exist', () => {
      expect(clearLoginInterval)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {
      expect(clearLoginInterval())
        .toBeA('object')
        .toEqual({
          type: MF_CLEAR_LOGIN_INTERVAL
        });
    });

  });

  describe('login', () =>{

    it('should exist', () => {
      expect(login)
        .toExist()
        .toBeA('function');
    });

    it('should return an action object', () => {
      const token = '12345abcde';
      expect(login(token))
        .toBeA('object')
        .toEqual({
          type: MF_LOGIN,
          payload: token
        });
    });

  });

});
