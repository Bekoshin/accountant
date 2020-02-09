import {ACTION_TYPES} from '../ACTION_TYPES';
import Operation from '../../entities/Operation';

export interface OperationState {
  operations: Map<Date, Operation[]>;
}

const initialState: OperationState = {
  operations: new Map(),
};

export default (state = initialState, action: any) => {
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
