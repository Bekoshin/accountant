import {Text, View} from 'react-native';
import React from 'react';
import styles from './noExpenses.styles';

export const NoExpensesComponent = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Расходы отсутсвуют</Text>
    </View>
  );
};
