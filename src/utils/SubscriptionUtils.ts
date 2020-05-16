import Subscription from '../entities/Subscription';
import moment from 'moment';
import Operation from '../entities/Operation';
import {Filter} from '../entities/Filter';
import StorageHandler from '../storage/StorageHandler';

export const createOperationBySubscription = (
  subscription: Subscription,
): Operation => {
  let {id, day, amount, category, note} = subscription;

  let currentDate = new Date();
  currentDate.setDate(day);
  const currentTimestamp = currentDate.setHours(0, 0, 0, 0);

  return new Operation(
    amount,
    category,
    currentTimestamp,
    note,
    false,
    id as number,
    undefined,
  );
};

const todayIsRecordDay = (
  currentDay: number,
  subscriptionDay: number,
): boolean => {
  let lastDayOfMonth = moment().daysInMonth();
  if (subscriptionDay > lastDayOfMonth) {
    //check if now short month, as February, etc
    subscriptionDay = lastDayOfMonth;
  }

  return currentDay === subscriptionDay;
};

const operationNotYetCreatedToday = async (
  currentDate: Date,
  subscriptionId: number,
): Promise<boolean> => {
  let filter: Filter = new Filter(
    undefined,
    undefined,
    [],
    currentDate,
    currentDate,
    '',
    subscriptionId,
  );

  let storageHandler = new StorageHandler();
  await storageHandler.initOperationRepo();
  const operations: Operation[] = await storageHandler.getFilteredOperations(
    filter,
  );
  return operations.length === 0;
};

export const needToCreateOperation = async (subscription: Subscription) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  return (
    todayIsRecordDay(currentDay, subscription.day) &&
    (await operationNotYetCreatedToday(currentDate, subscription.id as number))
  );
};

export const groupByDay = (
  subscriptions: Subscription[],
): Map<string, Subscription[]> => {
  let subscriptionMap = new Map<string, Subscription[]>();
  for (let subscription of subscriptions) {
    const day = subscription.day.toString();
    if (!subscriptionMap.has(day)) {
      subscriptionMap.set(day, []);
    }
    (subscriptionMap.get(day) as Subscription[]).push(subscription);
  }
  return subscriptionMap;
};
