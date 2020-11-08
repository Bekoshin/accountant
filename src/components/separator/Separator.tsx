import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import styles from './styles';

type SeparatorProps = {
  style?: StyleProp<ViewStyle>;
};

export const Separator = (props: SeparatorProps) => {
  const {style} = props;
  return <View style={[styles.mainContainer, style]} />;
};
