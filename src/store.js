import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  createLogger()
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}