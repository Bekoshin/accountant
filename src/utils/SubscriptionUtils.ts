import Subscription from '../entities/Subscription';
import moment from 'moment';
import Operation from '../entities/Operation';

export const createOperationBySubscription = (
  subscription: Subscription,
): Operation => {
  let {id, day, value, category, note} = subscription;

  let currentDate = new Date();
  currentDate.setDate(day);
  const currentTimestamp = currentDate.setHours(0, 0, 0, 0);

  return new Operation(
    value,
    category,
    currentTimestamp,
    note,
    false,
    id as number,
    undefined,
  );
};

export const todayIsRecordDay = (subscriptionDay: number): boolean => {
  let lastDayOfMonth = moment().daysInMonth();
  if (subscriptionDay > lastDayOfMonth) {
    //check if now short month, as February, etc
    subscriptionDay = lastDayOfMonth;
  }
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  return currentDay === subscriptionDay;
};
