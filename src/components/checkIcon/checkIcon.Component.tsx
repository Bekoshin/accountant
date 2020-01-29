import {Image, View} from 'react-native';
import IMAGES from '../../images';
import React from 'react';
import styles from './checkIcon.styles';

const CheckIcon = (isSelected: boolean | undefined) => {
  if (isSelected) {
    return (
      <View style={styles.mainContainer}>
        <Image resizeMode="contain" source={IMAGES.CHECK} />
      </View>
    );
  }
};

export default CheckIcon;
