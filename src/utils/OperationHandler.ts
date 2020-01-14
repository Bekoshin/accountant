import Operation from '../entities/Operation';
import Category from '../entities/Category';

export default class OperationHandler {
  public static groupByDate = (
    operations: Operation[],
  ): Map<Date, Operation[]> => {
    let operationsMap = new Map();
    operations.forEach(operation => {
      const operationDate = new Date(operation.date).setHours(0, 0, 0, 0);
      if (!operationsMap.has(operationDate)) {
        operationsMap.set(operationDate, []);
      }
      operationsMap.get(operationDate).push(operation);
    });
    return operationsMap;
  };

  public static groupByCategory = (
    operations: Operation[],
  ): Map<Category, Operation[]> => {
    let operationsMap = new Map();
    operations.forEach(operation => {
      const operationId = operation.category.id;
      if (operationId) {
        const operationIdStr = operationId.toString();
        if (!operationsMap.has(operationIdStr)) {
          operationsMap.set(operationIdStr, []);
        }
        operationsMap.get(operationIdStr).push(operation);
      }
    });
    return operationsMap;
  };
}
