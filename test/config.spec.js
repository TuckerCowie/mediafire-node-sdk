import expect from 'expect';
import * as actions from '../src/config/actions';
import reducer from '../src/config/reducer';

describe('Config', () => {

  const initialState = {
    id: null,
    key: null,
    url: 'https://www.mediafire.com/api/',
    version: '1.5'
  };

  const mockConfig = {
    id: 12345,
    key: 'someKey'
  };

  const mockAction = {
    type: actions.MF_CONFIG_UPDATE,
    payload: mockConfig
  };

  describe('Actions', () => {
    describe('updateConfig', () => {
      it('should make update config action', () => {
        expect(actions.updateConfig(mockConfig)).toEqual(mockAction);
      });
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {}))
        .toEqual(initialState);
    });

    it('should handle MF_CONFIG_UPDATE', () => {
      expect(reducer(undefined, actions.updateConfig(mockConfig)))
        .toEqual({...initialState, ...mockConfig});
    });
  });
});
