import {actionTypes} from '../actionTypes';
import Expense from '../../entities/Expense';

export interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.EXPENSES_LOADED: {
      return {
        ...state,
        expenses: action.expenses,
      };
    }
    default:
      return state;
  }
};
