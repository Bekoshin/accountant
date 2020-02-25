import Operation from '../entities/Operation';
import moment from 'moment';
import DateHandler from './DateHandler';

export const groupByDate = (
  operations: Operation[],
): Map<string, Operation[]> => {
  let operationsMap = new Map();
  operations.forEach(operation => {
    const operationDate = new Date(operation.date)
      .setHours(0, 0, 0, 0)
      .toString();
    if (!operationsMap.has(operationDate)) {
      operationsMap.set(operationDate, []);
    }
    operationsMap.get(operationDate).push(operation);
  });
  return operationsMap;
};

export const groupByMonth = (
  operations: Operation[],
): Map<string, Operation[]> => {
  let operationsMap = new Map();
  operations.forEach(operation => {
    const operationDate = new Date(
      operation.date.getFullYear(),
      operation.date.getMonth(),
    ).toString();
    if (!operationsMap.has(operationDate)) {
      operationsMap.set(operationDate, []);
    }
    operationsMap.get(operationDate).push(operation);
  });
  return operationsMap;
};

export const groupByCategory = (
  operations: Operation[],
): Map<string, Operation[]> => {
  let operationsMap = new Map();
  operations.forEach(operation => {
    const categoryId = operation.category.id;
    if (categoryId) {
      const operationIdStr = categoryId.toString();
      if (!operationsMap.has(operationIdStr)) {
        operationsMap.set(operationIdStr, []);
      }
      operationsMap.get(operationIdStr).push(operation);
    }
  });
  return operationsMap;
};

export const filterOperationsByDate = (
  operations: Operation[],
  selectedDate: moment.Moment,
  selectedInterval: 'isoWeek' | 'month' | 'year',
): Operation[] => {
  let filteredOperations: Operation[] = [];
  for (let operation of operations) {
    if (
      DateHandler.isDateInSelectedInterval(
        operation.date,
        selectedDate,
        selectedInterval,
      )
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
