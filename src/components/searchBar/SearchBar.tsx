import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Input} from '../input/Input';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClearButtonPress?: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  inAppBar?: boolean;
};

export const SearchBar = (props: SearchBarProps) => {
  const {
    value,
    onChangeText,
    onClearButtonPress,
    style,
    autoFocus,
    inAppBar,
  } = props;

  return (
    <Input
      style={style}
      value={value}
      onChangeText={onChangeText}
      icon={inAppBar ? 'close' : 'search'}
      placeholder="Поиск"
      onClearButtonPress={onClearButtonPress}
      onIconButtonPress={onClearButtonPress}
      autoFocus={autoFocus}
    />
  );
};
