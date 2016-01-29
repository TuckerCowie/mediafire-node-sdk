import expect from 'expect';
import MediaFire from '../src/';
import {MF_RESOURCE_REQUEST, requestResource} from '../src/requests/actions.js'
import sinon from 'sinon';
import ValidationError from '../src/lib/ValidationError';

describe('MediaFire', () => {

  it('should exist', () => {
    expect(MediaFire)
      .toExist()
      .toBeA('function');
  });

  describe('constructor', () => {

    it('should throw when no id or key is present in params', () => {
      expect(() => {
        new MediaFire();
      }).toThrow(ValidationError);
    });

    it('should initialize redux store', () => {
      const Api = new MediaFire('email', 'password', {id: 1, key: 'happy'});
      expect(Api._store).toExist();
      expect(Api._store.getState()).toBeA('object');
    });

  });

  describe('_login', () => {

    let Api;

    beforeEach(() => {
      Api = new MediaFire('email', 'password', {id: 1, key: 'happy'});
    });

    it('should return an object', () => {
      expect(Api._login('email', 'password')).toBeA('object');
    });

  });

  describe('request', () => {

    let Api;

    beforeEach(() => {
      Api = new MediaFire('email', 'password', {id: 1, key: 'happy'});
    });

    it('should return an object', () => {
      expect(Api.request('get', '/url', {fakeParams: true})).toBeA('object');
    });

  });

});