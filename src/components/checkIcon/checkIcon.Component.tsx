import {Image, View} from 'react-native';
import IMAGES from '../../images';
import React from 'react';

const CheckIcon = (isSelected: boolean | undefined) => {
  if (isSelected) {
    return (
      <View style={{position: 'absolute', right: 4, top: 4}}>
        <Image resizeMode="contain" source={IMAGES.CHECK} />
      </View>
    );
  }
};

export default CheckIcon;
