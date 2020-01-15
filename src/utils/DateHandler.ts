import I18n from '../i18n/i18n';
import moment from 'moment';

export default class DateHandler {
  public static convertDate = (date: Date) => {
    if (date) {
      const today = new Date();
      if (DateHandler.compareDates(today, date)) {
        return I18n.t('today');
      }
      let yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (DateHandler.compareDates(yesterday, date)) {
        return I18n.t('yesterday');
      }
      return moment(date)
        .local()
        .format('LL');
    }
    return '';
  };

  private static compareDates = (firstDate: Date, secondDate: Date) => {
    return !!(
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  };

  public static isDateInSelectedInterval = (
    date: Date,
    selectedDate: moment.Moment,
    selectedInterval: 'isoWeek' | 'month' | 'year',
  ) => {
    const dateBetweenInterval = moment(selectedDate);
    const startOfInterval = dateBetweenInterval.startOf(selectedInterval);
    const endOfInterval = dateBetweenInterval.endOf(selectedInterval);
    return moment(date).isBetween(
      startOfInterval,
      endOfInterval,
      selectedInterval,
      '[]',
    );
  };
}
