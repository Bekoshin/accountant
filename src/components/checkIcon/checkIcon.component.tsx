import React from 'react';
import {Image, View} from 'react-native';
import IMAGES from '../../images';
import styles from './checkIcon.styles';

interface CheckIconProps {
  isSelected: boolean | undefined;
}

export const CheckIcon = (props: CheckIconProps) => {
  const {isSelected} = props;

  if (isSelected) {
    return (
      <View style={styles.mainContainer}>
        <Image resizeMode="contain" source={IMAGES.CHECK} />
      </View>
    );
  }
  return null;
};
