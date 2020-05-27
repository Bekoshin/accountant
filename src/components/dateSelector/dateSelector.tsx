import moment from 'moment';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

type DateSelectorProps = {
  type: 'isoWeek' | 'month' | 'year';
  date: moment.Moment;
  changeDate: (date: moment.Moment) => void;
};

export const DateSelector = (props: DateSelectorProps) => {
  const {type, date, changeDate} = props;

  const handleRightButton = () => {
    let newDate = moment(date);

    if (type === 'isoWeek') {
      newDate.add(1, 'week');
    } else if (type === 'month') {
      newDate.add(1, 'month');
    } else if (type === 'year') {
      newDate.add(1, 'year');
    }
    changeDate(newDate);
  };

  const handleLeftButton = () => {
    let newDate = moment(date);

    if (type === 'isoWeek') {
      newDate.subtract(1, 'week');
    } else if (type === 'month') {
      newDate.subtract(1, 'month');
    } else if (type === 'year') {
      newDate.subtract(1, 'year');
    }
    changeDate(newDate);
  };

  const renderDate = () => {
    if (type === 'isoWeek') {
      return (
        <Text>
          {date.startOf('isoWeek').format('D MMM') +
            ' - ' +
            date.endOf('isoWeek').format('D MMM')}
        </Text>
      );
    } else if (type === 'month') {
      return <Text>{date.format('MMMM')}</Text>;
    } else if (type === 'year') {
      return <Text>{date.format('YYYY')}</Text>;
    }
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={handleLeftButton}>
        <Icon size={24} name="chevron-left" color="blue" />
      </TouchableOpacity>
      {renderDate()}
      <TouchableOpacity onPress={handleRightButton}>
        <Icon size={24} name="chevron-right" color="blue" />
      </TouchableOpacity>
    </View>
  );
};
