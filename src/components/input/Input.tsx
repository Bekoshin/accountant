import React from 'react';
import {
  KeyboardTypeOptions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import {LineAwesomeIcon} from '../../constants/LineAwesomeIconSet';
import styles from './styles';

const DEFAULT_HEIGHT = 46;

type InputProps = {
  parentRef?: (parentRef: TextInput) => void;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  selectTextOnFocus?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  icon?: string;
  onClearButtonPress?: () => void;
  onIconButtonPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  error?: boolean;
  autoFocus?: boolean;
  color?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export const Input = (props: InputProps) => {
  const {
    parentRef,
    value,
    onChangeText,
    style,
    placeholder,
    editable,
    autoCapitalize,
    autoCorrect,
    selectTextOnFocus,
    secureTextEntry,
    multiline,
    icon,
    onClearButtonPress,
    onIconButtonPress,
    keyboardType,
    pointerEvents,
    error,
    autoFocus,
    color,
    onBlur,
    onFocus,
    onLayout,
  } = props;

  let height;
  if (!multiline) {
    height = DEFAULT_HEIGHT;
  }

  const renderIcon = () => {
    if (error) {
      return (
        <View>
          <View style={styles.iconContainer}>
            <LineAwesomeIcon name="ban" size={18} color={COLORS.SECONDARY_3} />
          </View>
        </View>
      );
    } else if (onClearButtonPress && value !== '') {
      return (
        <TouchableOpacity onPress={onClearButtonPress}>
          <View style={styles.iconContainer}>
            <LineAwesomeIcon
              name="close"
              size={18}
              color={COLORS.SECONDARY_DARK_1}
            />
          </View>
        </TouchableOpacity>
      );
    } else if (icon) {
      return (
        <TouchableOpacity
          onPress={onIconButtonPress}
          disabled={!onIconButtonPress}>
          <View style={styles.iconContainer}>
            <LineAwesomeIcon
              name={icon}
              size={18}
              color={COLORS.SECONDARY_DARK_1}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  let backgroundColor = 'white';
  if (error) {
    backgroundColor = COLORS.SECONDARY_3 + '14';
  }
  if (color) {
    backgroundColor = color;
  }

  return (
    <View
      style={[
        styles.mainContainer,
        style,
        {
          minHeight: DEFAULT_HEIGHT,
          height: height,
          backgroundColor: backgroundColor,
        },
      ]}>
      <TextInput
        onLayout={onLayout}
        ref={parentRef}
        style={styles.inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.SECONDARY_DARK_2}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        selectTextOnFocus={selectTextOnFocus}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
        keyboardType={keyboardType}
        pointerEvents={pointerEvents}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {renderIcon()}
    </View>
  );
};
