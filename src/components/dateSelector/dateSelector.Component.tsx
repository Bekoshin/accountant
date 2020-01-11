import styles from './dateSelector.styles';
import moment from 'moment';
import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface DateSelectorProps {
  type: 'week' | 'month' | 'year';
  date: moment.Moment;
  changeDate: (date: moment.Moment) => void;
}

export default class DateSelector extends PureComponent<DateSelectorProps> {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
        }}>
        <TouchableOpacity onPress={this.handleLeftButton}>
          <Icon size={24} name="chevron-left" color="blue" />
        </TouchableOpacity>
        {this.renderDate()}
        <TouchableOpacity onPress={this.handleRightButton}>
          <Icon size={24} name="chevron-right" color="blue" />
        </TouchableOpacity>
      </View>
    );
  }

  renderDate() {
    const {type} = this.props;
    let date = this.props.date;

    if (type === 'week') {
      return (
        <Text>
          {date.startOf('week').format('D MMM') +
            ' - ' +
            date.endOf('week').format('D MMM')}
        </Text>
      );
    } else if (type === 'month') {
      return <Text>{date.format('MMMM')}</Text>;
    } else if (type === 'year') {
      return <Text>{date.format('YYYY')}</Text>;
    }
  }

  handleRightButton = () => {
    let {type} = this.props;
    let date = moment(this.props.date);

    if (type === 'week') {
      date.add(1, 'week');
    } else if (type === 'month') {
      date.add(1, 'month');
    } else if (type === 'year') {
      date.add(1, 'year');
    }
    this.props.changeDate(date);
  };

  handleLeftButton = () => {
    let {type} = this.props;
    let date = moment(this.props.date);

    if (type === 'week') {
      date.subtract(1, 'week');
    } else if (type === 'month') {
      date.subtract(1, 'month');
    } else if (type === 'year') {
      date.subtract(1, 'year');
    }
    this.props.changeDate(date);
  };
}
