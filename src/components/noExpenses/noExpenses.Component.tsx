import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from './noExpenses.styles';

export default class NoExpensesComponent extends Component{
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text>Расходы отсутсвуют</Text>
      </View>
    );
  }
}
