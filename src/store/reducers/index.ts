import {combineReducers} from 'redux';
import homeReducer from './homeReducer';
import operationReducer from './operationReducer';
import categoryReducer from './categoryReducer';

export default combineReducers({
  homeReducer,
  operationReducer,
  categoryReducer,
});
