import Subscription from '../entities/Subscription';
import moment from 'moment';
import Operation from '../entities/Operation';

export const createOperationBySubscriptionIfNeeded = (
  subscription: Subscription,
): Operation | null => {
  let lastDayOfMonth = moment().daysInMonth();

  let {day} = subscription;
  if (day > lastDayOfMonth) {
    day = lastDayOfMonth;
  }
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  if (currentDay === day) {
    return createOperationBySubscription(subscription);
  }

  return null;
};

export const createOperationBySubscription = (
  subscription: Subscription,
): Operation => {
  let {day, value, category, note} = subscription;

  let currentDate = new Date();
  currentDate.setDate(day);
  const currentTimestamp = currentDate.setHours(0, 0, 0, 0);

  return new Operation(
    value,
    category,
    currentTimestamp,
    note,
    false,
    true,
    undefined,
  );
};

export const ifTodayIsRecordDay
