import {Text, View} from 'react-native';
import React, {Component} from 'react';
import styles from './styles';

export default class NoExpenses extends Component{
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text>Расходы отсутсвуют</Text>
      </View>
    );
  }
}
