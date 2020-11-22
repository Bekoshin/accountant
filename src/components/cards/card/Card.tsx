import React, {FunctionComponent} from 'react';
import {COLORS} from '../../../constants/colors';
import {StyleProp, TouchableHighlight, View, ViewStyle} from 'react-native';
import {styles} from './styles';

type CardProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const Card: FunctionComponent<CardProps> = (props) => {
  const {children, onPress, style, disabled} = props;

  return (
    <TouchableHighlight
      style={[styles.mainContainer, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
      underlayColor={COLORS.PRIMARY_DARK}>
      <View style={styles.contentContainer}>{children}</View>
    </TouchableHighlight>
  );
};
