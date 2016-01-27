import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  createLogger({
    predicate: (getState) => getState().apiConfig.debug
  })
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
