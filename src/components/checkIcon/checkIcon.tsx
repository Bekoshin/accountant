import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CheckIconProps {
  isSelected: boolean | undefined;
}

export const CheckIcon = (props: CheckIconProps) => {
  const {isSelected} = props;

  if (isSelected) {
    return (
      <View style={styles.mainContainer}>
        <Icon size={24} name="check-circle" color="white" />
      </View>
    );
  }
  return null;
};
