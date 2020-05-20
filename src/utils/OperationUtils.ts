import Operation from '../entities/Operation';
import moment from 'moment';
import {isDateInSelectedInterval} from './DateUtils';
import {ThunkAction} from 'redux-thunk';
import {AppState} from '../store/store';
import {Action} from 'redux';
import StorageHandler from '../storage/StorageHandler';
import {ACTION_TYPES} from '../store/ACTION_TYPES';
import {OperationEntity} from '../entities/OperationEntity';

export const saveOperation = (
  operation: Operation,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  const storageHandler = await StorageHandler.getInstance();
  await storageHandler.saveOperation(operation);
  const operations = await storageHandler.getAllOperations();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
};
export const deleteOperation = (
  operation: Operation,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  const storageHandler = await StorageHandler.getInstance();
  await storageHandler.deleteOperation(operation);
  const operations = await storageHandler.getAllOperations();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
};

export const groupByDate = (
  operations: Operation[],
): Map<string, Operation[]> => {
  let operationsMap = new Map<string, Operation[]>();
  operations.forEach(operation => {
    const operationDate = new Date(operation.date)
      .setHours(0, 0, 0, 0)
      .toString();
    if (!operationsMap.has(operationDate)) {
      operationsMap.set(operationDate, []);
    }
    (operationsMap.get(operationDate) as Operation[]).push(operation);
  });
  return operationsMap;
};

export const groupByMonth = (
  operations: Operation[],
): Map<string, Operation[]> => {
  let operationsMap = new Map<string, Operation[]>();
  operations.forEach(operation => {
    const operationDate = new Date(
      operation.date.getFullYear(),
      operation.date.getMonth(),
    ).toString();
    if (!operationsMap.has(operationDate)) {
      operationsMap.set(operationDate, []);
    }
    (operationsMap.get(operationDate) as Operation[]).push(operation);
  });
  return operationsMap;
};

export const groupByCategory = (
  entities: OperationEntity[],
): Map<string, OperationEntity[]> => {
  let entitiesMap = new Map<string, OperationEntity[]>();
  entities.forEach(entity => {
    const categoryId = entity.category.id;
    if (categoryId) {
      const entityIdStr = categoryId.toString();
      if (!entitiesMap.has(entityIdStr)) {
        entitiesMap.set(entityIdStr, []);
      }
      (entitiesMap.get(entityIdStr) as OperationEntity[]).push(entity);
    }
  });
  return entitiesMap;
};

export const filterOperationsByDate = (
  operations: Operation[],
  selectedDate: moment.Moment,
  selectedInterval: 'isoWeek' | 'month' | 'year',
): Operation[] => {
  let filteredOperations: Operation[] = [];
  for (let operation of operations) {
    if (
      isDateInSelectedInterval(operation.date, selectedDate, selectedInterval)
    ) {
      filteredOperations.push(operation);
    }
  }
  return filteredOperations;
};

export const calculateTotalAmount = (operations: Operation[]): number => {
  let total = 0;
  for (let operation of operations) {
    total += operation.amount;
  }
  return total;
};

export const formatNumberToDecimal = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};
