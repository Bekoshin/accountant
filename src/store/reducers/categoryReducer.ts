import {ACTION_TYPES} from '../ACTION_TYPES';
import Category from '../../entities/Category';

export interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.CATEGORIES_LOADED: {
      return {
        ...state,
        categories: action.categories,
      };
    }
    default:
      return state;
  }
};
