import configureMockStore from 'redux-mock-store'
import expect from 'expect';
import * as actions from '../src/login/actions';
import reducer from '../src/login/reducer';
import thunk from 'redux-thunk';

describe('Login', () => {

  const mockToken = '12345.abcde.!@#$%';
  const mockInterval = 35;
  const mockAction = {
    type: actions.MF_LOGIN_RENEW,
    payload: {
      token: mockToken,
      interval: mockInterval
    }
  };
  const mockDispatch = action => action;

  describe('Async Action', () => {

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    describe('renewLogin', () => {
      /** @TODO: Figure out how to test recursive action creators */
      it.skip('should make renew login action', done => {
        const expectedActions = [{
          type: actions.MF_LOGIN_RENEW,
          payload: {
            token: mockToken,
            interval: mockInterval
          }
        }];
        const store = mockStore({}, expectedActions, done);
        store.dispatch(actions.renewLogin(mockToken, mockInterval));
      });
    });

    describe('login', () => {
      it('should make login action', done => {
        const expectedActions = [
          {type: actions.MF_LOGIN, payload: { token: mockToken, stayLoggedIn: false }}
        ];
        const store = mockStore({}, expectedActions, done);
        store.dispatch(actions.login(mockToken));
      });
    });
  });

  describe('Helper', () => {
    describe('createLoginTimeout', () => {
      it('should return a timeout function', done => {
        const timeout = actions.createLoginTimeout(mockDispatch, mockInterval, mockDispatch(mockAction));
        expect(timeout).toBeA('object');
        expect(timeout._called).toBe(false);
        expect(timeout._idleTimeout).toBe(mockInterval);
        setTimeout(() => {
          expect(timeout._called).toBe(true);
          done();
        }, mockInterval + 1);
      });
    });
  });

  describe('Reducer', () => {

    const initialState = {
      token: null,
      stayLoggedIn: false
    };

    it('should return the initial state', () => {
      expect(reducer(undefined, {}))
        .toEqual(initialState);
    });
    it('should handle MF_LOGIN', () => {
      expect(reducer(undefined, {
        type: actions.MF_LOGIN,
        payload: {
          token: mockToken,
          stayLoggedIn: true
        }
      }))
        .toEqual({
          token: mockToken,
          stayLoggedIn: true
        });
      expect(reducer(undefined, {
        type: actions.MF_LOGIN,
        payload: {
          token: mockToken,
          stayLoggedIn: false
        }
      }))
        .toEqual({
          token: mockToken,
          stayLoggedIn: false
        });
    });
    it('should handle MF_LOGIN_RENEW', () => {
      expect(reducer(undefined, actions.renewLogin(`${mockToken}54321`)(mockDispatch)))
        .toEqual({
          token: `${mockToken}54321`,
          stayLoggedIn: true,
          interval: 57000
        });
    });
  });
});
