import moment from "moment";
import I18n from "../i18n/i18n";
import {TABS_COUNT, UnitOfDate} from "../screens/home/home";

export const createRouteTitles = (unitOfDate: UnitOfDate): string[] => {
  const date = moment();
  let titles: string[] = [];
  const {currentTitle, lastTitle} = createTitleForLastTwoTabs(date, unitOfDate);
  for (let i = 0; i < TABS_COUNT; i++) {
    let title = createTabTitle(i, date, unitOfDate);
    if (i === TABS_COUNT - 2) {
      title = lastTitle;
    }
    if (i === TABS_COUNT - 1) {
      title = currentTitle;
    }
    titles.push(title);
  }
  return titles;
};

export const changeRoutesTitle = (titles: string[], unitOfDate: UnitOfDate) => {
  const date = moment();
  const {currentTitle, lastTitle} = createTitleForLastTwoTabs(date, unitOfDate);
  for (let i = 0; i < titles.length; i++) {
    let title = createTabTitle(i, date, unitOfDate);
    if (i === TABS_COUNT - 2) {
      title = lastTitle;
    }
    if (i === TABS_COUNT - 1) {
      title = currentTitle;
    }
    titles[i] = title;
  }
};

const createTitleForLastTwoTabs = (
  date: moment.Moment,
  unitOfDate: UnitOfDate,
): {currentTitle: string; lastTitle: string} => {
  let currentTitle = '';
  let lastTitle = '';
  if (unitOfDate === 'isoWeek') {
    date.subtract(TABS_COUNT - 1, 'week');
    currentTitle = I18n.t('label_this_week');
    lastTitle = I18n.t('label_last_week');
  } else if (unitOfDate === 'month') {
    date.subtract(TABS_COUNT - 1, 'month');
    currentTitle = I18n.t('label_this_month');
    lastTitle = I18n.t('label_last_month');
  } else if (unitOfDate === 'year') {
    date.subtract(TABS_COUNT - 1, 'year');
    currentTitle = I18n.t('label_this_year');
    lastTitle = I18n.t('label_last_year');
  }
  return {currentTitle, lastTitle};
};

const createTabTitle = (
  index: number,
  date: moment.Moment,
  unitOfDate: UnitOfDate,
): string => {
  let title = '';
  if (unitOfDate === 'isoWeek') {
    title =
      date.startOf('isoWeek').format('D MMM') +
      ' - ' +
      date.endOf('isoWeek').format('D MMM');
    date.add(1, 'week');
  } else if (unitOfDate === 'month') {
    title = date.format('MMMM') + ', ' + date.format('YY');
    date.add(1, 'month');
  } else if (unitOfDate === 'year') {
    title = date.format('YYYY');
    date.add(1, 'year');
  }
  return title;
};
