import {Text, View} from 'react-native';
import React from 'react';
import styles from './styles';

export const NoExpenses = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Расходы отсутсвуют</Text>
    </View>
  );
};
