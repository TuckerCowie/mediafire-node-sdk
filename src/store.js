import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import reduxPromiseMiddleware from 'redux-promise-middleware'
import rootReducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  createLogger({
    predicate: (getState) => getState().config.debug
  })
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
