import Subscription from '../entities/Subscription';
import moment from 'moment';
import Operation from '../entities/Operation';

export const createOperationBySubscriptionIfNeeded = (
  subscription: Subscription,
): Operation | null => {
  let lastDayOfMonth = moment().daysInMonth();

  let {day, value, category, note} = subscription;
  if (day > lastDayOfMonth) {
    day = lastDayOfMonth;
  }
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentTimestamp = +currentDate;

  if (currentDay === day) {
    return new Operation(
      value,
      category,
      currentTimestamp,
      note,
      false,
      true,
      undefined,
    );
  }

  return null;
};
