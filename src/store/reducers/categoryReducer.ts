import {actionTypes} from '../actionTypes';
import Category from '../../entities/Category';

export interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.CATEGORIES_LOADED: {
      return {
        ...state,
        categories: action.categories,
      };
    }
    default:
      return state;
  }
};
