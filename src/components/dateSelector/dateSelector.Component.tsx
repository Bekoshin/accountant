import styles from './dateSelector.styles';
import moment from 'moment';
import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface DateSelectorProps {
  type: 'day' | 'month' | 'year';
  date: moment.Moment;
}

export default class DateSelector extends PureComponent<DateSelectorProps> {
  state = {
    date: this.props.date,
  };

  render() {
    const {type, date} = this.props;

    return (
      <View
        style={{
          backgroundColor: 'red',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon size={24} name="chevron-left" color="blue" />
        <Text>{this.renderDate()}</Text>
        <Icon size={24} name="chevron-right" color="blue" />
      </View>
    );
  }

  renderDate() {
    const {type} = this.props;
    let date = this.state.date;
    if (type === 'day') {
      return date.format('l');
    } else if (type === 'month') {
      return date.format('MMMM');
    } else if (type === 'year') {
      return date.format('YYYY');
    }
  }
}
