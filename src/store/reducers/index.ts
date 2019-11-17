import {combineReducers} from 'redux';
import home from './home';
import expense from './expense';

export default combineReducers({
  home,
  expense,
});
