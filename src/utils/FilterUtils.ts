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
  let storageHandler = new StorageHandler();
  await storageHandler.initOperationRepo();
  let operations: Operation[];

  if (filter) {
    operations = await storageHandler.getFilteredOperations(filter);
  } else {
    operations = await storageHandler.getAllOperationsFromRepo();
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
