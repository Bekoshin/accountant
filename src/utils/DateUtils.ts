import I18n from '../i18n/i18n';
import moment from 'moment';

export const convertDate = (date: Date | null | undefined) => {
  if (date) {
    const today = new Date();
    if (compareDates(today, date)) {
      return I18n.t('today');
    }
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (compareDates(yesterday, date)) {
      return I18n.t('yesterday');
    }
    return moment(date)
      .local()
      .format('LL');
  }
  return '';
};

export const getMonthName = (date: Date) => {
  return moment(date)
    .local()
    .format('MMMM');
};

const compareDates = (firstDate: Date, secondDate: Date) => {
  return !!(
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

export const isDateInSelectedInterval = (
  date: Date,
  selectedDate: moment.Moment,
  selectedInterval: 'isoWeek' | 'month' | 'year',
) => {
  const dateBetweenInterval = moment(selectedDate);
  const startOfInterval = moment(dateBetweenInterval).startOf(selectedInterval);
  const endOfInterval = moment(dateBetweenInterval).endOf(selectedInterval);
  return moment(date).isBetween(
    startOfInterval,
    endOfInterval,
    selectedInterval,
    '[]',
  );
};
