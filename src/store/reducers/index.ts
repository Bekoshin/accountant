import {combineReducers} from 'redux';
import home from './home';
import operation from './operation';
import category from './category';

export default combineReducers({
  home,
  operation,
  category,
});
