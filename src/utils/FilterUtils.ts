import {Filter} from '../entities/Filter';
import {ThunkAction} from 'redux-thunk';
import {AppState} from '../store/store';
import {Action} from 'redux';
import StorageHandler from '../storage/StorageHandler';
import Operation from '../entities/Operation';
import {ACTION_TYPES} from '../store/ACTION_TYPES';

export const applyFilter = (
  filter: Filter | null,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = await StorageHandler.getInstance();
  let operations: Operation[];

  if (filter) {
    operations = await storageHandler.getFilteredOperations(filter);
  } else {
    operations = await storageHandler.getAllOperations();
  }

  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
  dispatch({
    type: ACTION_TYPES.FILTER_CHANGED,
    filter: filter,
  });
};
