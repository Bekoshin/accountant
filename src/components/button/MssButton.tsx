import React from 'react';
import {
  StyleProp,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import {COLORS} from '../../constants/colors';

type ButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  height?: number;
};

export const Button = (props: ButtonProps) => {
  const {label, onPress, disabled, style, color, textColor, height} = props;

  let backgroundColor = COLORS.PRIMARY;
  let labelColor = 'white';
  let buttonHeight = 46;
  if (height) {
    buttonHeight = height;
  }
  if (color) {
    backgroundColor = color;
  }
  if (textColor) {
    labelColor = textColor;
  }
  // if (disabled) {
  //   backgroundColor = COLORS.BACKGROUND_1;
  //   labelColor = COLORS.SECONDARY_DARK_1;
  // }

  return (
    <View style={[styles.mainContainer, style]}>
      <TouchableHighlight
        style={styles.touchableContainer}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
        underlayColor={COLORS.PRIMARY_DARK}>
        <View
          style={[
            styles.buttonContainer,
            {backgroundColor: backgroundColor, height: buttonHeight},
          ]}>
          <Text style={[styles.label, {color: labelColor}]}>{label}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
