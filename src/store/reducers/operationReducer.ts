import {ACTION_TYPES} from '../ACTION_TYPES';
import Operation from '../../entities/Operation';

type OperationState = {
  operations: Operation[];
};

type Action = {
  type: string;
  operations: Operation[];
};

const initialState: OperationState = {
  operations: [],
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPES.OPERATIONS_LOADED: {
      return {
        ...state,
        operations: action.operations,
      };
    }
    default:
      return state;
  }
};
