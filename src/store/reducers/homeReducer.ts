import Category from '../../entities/Category';
import {Filter} from '../../entities/Filter';
import {ACTION_TYPES} from '../ACTION_TYPES';

export interface HomeState {}

export interface CategoryState {
  filter: Filter | null;
}

const initialState: HomeState = {
  filter: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.FILTER_CHANGED: {
      return {
        ...state,
        filter: action.filter,
      };
    }
    default:
      return state;
  }
};
