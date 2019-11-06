import {applyMiddleware, compose, createStore} from 'redux';
import * as thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import reducers from './reducers';

const logger = createLogger();
const enhancer = compose(
  __DEV__
    ? applyMiddleware(thunkMiddleware.default, logger)
    : applyMiddleware(thunkMiddleware.default),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export type AppState = ReturnType<typeof reducers>;
const store = createStore(reducers, enhancer);
export default store;
