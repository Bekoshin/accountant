import {combineReducers} from 'redux';
import homeReducer from './homeReducer';
import operationReducer from './operationReducer';
import categoryReducer from './categoryReducer';
import subscriptionReducer from './subscriptionReducer';

export default combineReducers({
  homeReducer,
  operationReducer,
  categoryReducer,
  subscriptionReducer,
});
