import Operation from '../entities/Operation';
import Category from '../entities/Category';
import moment from 'moment';
import DateHandler from './DateHandler';

export default class OperationHandler {
  public static groupByDate = (
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

  public static groupByCategory = (
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

  public static filterOperationsByDate = (
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

  public static calculateTotalAmount = (operations: Operation[]): number => {
    let total = 0;
    for (let operation of operations) {
      total += operation.amount;
    }
    return total;
  };
}