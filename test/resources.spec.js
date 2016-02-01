import configureMockStore from 'redux-mock-store'
import expect from 'expect';
import formUrlEncode from 'form-urlencoded';
import MediaFire from '../src';
import Nock from 'nock';
import * as actions from '../src/resources/actions';
import reducer from '../src/resources/reducer';
import thunk from 'redux-thunk';

describe('Resources', () => {

  const mockMethod = 'get';
  const mockUri = '/user/get_session_token.php';
  const mockParams = {email: 'email@mail.com', password: '1337Password'};
  const mockResponse = new Response();
  const mockError = {name: 'Error', message: 'Something bad happened'};

  describe('Action', () => {
    describe('invalidateResource', () => {
      it('should make invalidate resource action', () => {
        expect(actions.invalidateResource(mockMethod, mockUri))
          .toEqual({
            type: actions.MF_RESOURCE_INVALIDATE,
            payload: {
              method: mockMethod,
              uri: mockUri
            }
          });
      });
    });
    describe('requestResource', () => {
      it('should make request resource action', () => {
        expect(actions.requestResource(mockMethod, mockUri, mockParams))
          .toEqual({
            type: actions.MF_RESOURCE_REQUEST,
            payload: {
              method: mockMethod,
              uri: mockUri,
              params: mockParams
            }
          });
      });
    });
    describe('receiveResource', () => {
      it('should make receive resource action', () => {
        expect(actions.receiveResource(mockMethod, mockUri, mockResponse))
          .toEqual({
            type: actions.MF_RESOURCE_RECEIVE,
            payload: {
              method: mockMethod,
              uri: mockUri,
              response: mockResponse
            }
          });
      });
    });
    describe('receiveResourceError', () => {
      it('should make receive resource error action', () => {
        expect(actions.receiveResourceError(mockMethod, mockUri, mockError))
          .toEqual({
            type: actions.MF_RESOURCE_RECEIVE_ERROR,
            payload: {
              method: mockMethod,
              uri: mockUri,
              error: mockError
            }
          });
      });
    });
  });

  describe('Async Action', () => {

    const middleWares = [thunk];
    const mockStore = configureMockStore(middleWares);

    describe('fetchResource', () => {
      afterEach(() => {
        Nock.cleanAll();
      });
      const mockBody = {winning: true};
      it('should dispatch request resource action and receive resource action on success', done => {
        const Api = new MediaFire({id: 12345, key: '12345abcde'});
        const state = Api._store.getState();
        const mockResponse = {session_token: 'asdfghjkl'};
        Nock('https://www.mediafire.com/')
          [mockMethod](`/api/${state.config.version}${mockUri}`)
          .query(true)
          .reply(200, mockResponse);
        const expectedActions = [
          {
            type: actions.MF_RESOURCE_REQUEST,
            payload: {
              params: mockParams,
              method: mockMethod,
              uri: mockUri
            }
          },
          {
            type: actions.MF_RESOURCE_RECEIVE,
            payload: {
              method: mockMethod,
              uri: mockUri,
              response: mockResponse
            }
          }
        ];
        Api._store = mockStore(state, expectedActions, done);
        Api._store.dispatch(actions.fetchResource(mockMethod, mockUri, mockParams));
      });
      /** @TODO: Correctly mock error case */
      it.skip('should dispatch request resource action and receive resource error action on fail',
        done => {
          const Api = new MediaFire({id: 12345, key: '12345abcde'});
          const state = Api._store.getState();
          const mockResponse = {session_token: 'asdfghjkl'};
          Nock('https://www.mediafire.com/')
            [mockMethod](`/api/${state.config.version}${mockUri}`)
            .query(true)
            .replyWithError(mockError);
          const expectedActions = [
            {
              type: actions.MF_RESOURCE_REQUEST,
              payload: {
                params: mockParams,
                method: mockMethod,
                uri: mockUri
              }
            },
            {
              type: actions.MF_RESOURCE_RECEIVE_ERROR,
              payload: {
                method: mockMethod,
                uri: mockUri,
                error: {}
              }
            }
          ];
          Api._store = mockStore(state, expectedActions, done);
          Api._store.dispatch(actions.fetchResource(mockMethod, mockUri, mockParams));
        }
      );
    });

  });

  describe('Helper', () => {
    describe('getCurrentResource', () => {
      it('should return undefined if no resource found', () => {
        expect(actions.getCurrentResource({}, mockMethod, mockUri))
          .toEqual(undefined);
        expect(actions.getCurrentResource({
          '/user/get_session_token.php': {
            post: {}
          }
        }, mockMethod, mockUri))
          .toEqual(undefined);
        expect(actions.getCurrentResource({
          '/user/get_info.php': {
            get: {}
          }
        }, mockMethod, mockUri))
          .toEqual(undefined);
      });
      it('should return the matching resource by uri by method', () => {
        expect(actions.getCurrentResource({
          [mockUri]: {
            [mockMethod]: mockParams
          }
        }, mockUri, mockMethod))
          .toEqual(mockParams);
      });
    });
    describe('shouldFetchResource', () => {
      it('should return true if undefined', () => {
        expect(actions.shouldFetchResource(undefined)).toBe(true);
      });
      it('should return false if resource.loading', () => {
        expect(actions.shouldFetchResource({loading: true})).toBe(false);
      });
      it('should return true if resource.invalid and false if !resource.invalid', () => {
        expect(actions.shouldFetchResource({invalid: true})).toBe(true);
        expect(actions.shouldFetchResource({invalid: false})).toBe(false);
      });
    });
  });

  describe('Reducer', () => {

    const initialRequest = {
      loading: false,
      invalid: false,
      data: {}
    };

    it('should return the initial state', () => {
      expect(reducer(undefined, {}))
        .toEqual({});
    });
    it('should handle MF_RESOURCE_INVALIDATE', () => {
      expect(reducer(undefined, actions.invalidateResource(mockMethod, mockUri)))
        .toEqual({
          [mockUri]: {
            [mockMethod]: {
              ...initialRequest,
              invalid: true
            }
          }
        });
    });
    it('should handle MF_RESOURCE_REQUEST', () => {
      expect(reducer(undefined, actions.requestResource(mockMethod, mockUri)))
        .toEqual({
          [mockUri]: {
            [mockMethod]: {
              ...initialRequest,
              invalid: false,
              loading: true
            }
          }
        });
    });
    it('should handle MF_RESOURCE_RECEIVE', () => {
      const action = actions.receiveResource(mockMethod, mockUri, mockResponse);
      expect(reducer(undefined, action))
        .toEqual({
          [mockUri]: {
            [mockMethod]: {
              ...initialRequest,
              invalid: false,
              loading: false,
              error: false,
              response: mockResponse,
              lastUpdated: action.payload.received
            }
          }
        });
    });
    it('should handle MF_RESOURCE_RECEIVE_ERROR', () => {
      const action = actions.receiveResourceError(mockMethod, mockUri, mockError);
      expect(reducer(undefined, action))
        .toEqual({
          [mockUri]: {
            [mockMethod]: {
              ...initialRequest,
              invalid: false,
              loading: false,
              error: mockError,
              lastUpdated: action.payload.received
            }
          }
        });
    });
  });
});

/** @TODO: Write tests for Async action creators */
