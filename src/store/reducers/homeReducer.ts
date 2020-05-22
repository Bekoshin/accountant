import {Filter} from '../../entities/Filter';
import {ACTION_TYPES} from '../ACTION_TYPES';

type HomeState = {
  filter: Filter | null;
};

type Action = {
  type: string;
  filter: Filter;
};

const initialState: HomeState = {
  filter: null,
};

export default (state = initialState, action: Action) => {
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
