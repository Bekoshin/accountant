import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  ImageStyle,
  KeyboardType,
} from 'react-native';
import I18n from '../../i18n/i18n';

import styles from './styles';
import IMAGES from '../../images';

export interface InputProps {
  style?: any | {};
  type?: string;
  required?: boolean;
  label: string;
  value: string;
  inputStyle?: any;
  helperTextStyle?: any;
  editable?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  multiline?: true;
  maxLength?: number;
  numberOfLines?: number;
  characterCount?: number;
  errorMessage?: string;
  keyboardType?: KeyboardType;
  selectTextOnFocus?: boolean;
  textAlignVertical?: 'center' | 'auto' | 'top' | 'bottom' | undefined;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  autoCorrect?: boolean | true;
  onChangeText?: (value: string) => void;
  onLayout?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onInputPress?: () => void;
  onClearPress?: () => void;
  ref?: (ref: Input | null) => void;
}

export default class Input extends React.PureComponent<InputProps> {
  private _animatedIsFocused: Animated.Value;

  constructor(props: InputProps) {
    super(props);
    this._animatedIsFocused = new Animated.Value(0);
  }

  state = {
    isFocused: false,
  };

  // componentWillMount(): void {
  //   this._animatedIsFocused = new Animated.Value(0);
  // }

  handleFocused = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate(): void {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused ? 1 : 0,
      duration: 250,
    }).start();
  }

  render() {
    let containerStyle = {
      ...styles.container,
      ...this.props.style,
    };
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onInputPress}
        disabled={!this.props.onInputPress || this.props.disabled}>
        <View style={containerStyle}>
          {this.renderInput()}
          {this.renderLabel()}
          {this.renderUnderlineView()}
          {this.renderRightIcon()}
        </View>
      </TouchableOpacity>
    );
  }

  renderLabel() {
    let {isFocused} = this.state;
    let animatedLabelStyle = {
      position: 'absolute',
      left: 12,
      zIndex: -100,
      fontFamily: 'Roboto',
      paddingTop: 0,
      paddingBottom: 0,
      lineHeight: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 12],
      }),
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 8],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: this.props.errorMessage
        ? '#b00020ff'
        : this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: ['grey', 'black'],
          }),
    };
    if (!this.props.value) {
      return (
        <Animated.Text style={animatedLabelStyle} selectable={false}>
          {this.props.label}
        </Animated.Text>
      );
    } else {
      let labelStyle = {
        ...styles.label,
        color: this.props.errorMessage
          ? '#b00020ff'
          : isFocused
          ? 'black'
          : 'grey',
      };
      return <Text style={labelStyle}>{this.props.label}</Text>;
    }
  }

  renderInput() {
    if (this.props.onInputPress) {
      let textInputStyle = {
        ...styles.textContainer,
        ...this.props.inputStyle,
        borderBottomWidth: this.state.isFocused ? 2 : 1,
        paddingBottom: this.state.isFocused ? 11 : 12,
      };
      return (
        <View style={textInputStyle}>
          <Text style={styles.text}>{this.props.value}</Text>
        </View>
      );
    } else {
      let textInputStyle = {
        ...styles.input,
        ...this.props.inputStyle,
        borderBottomWidth: this.state.isFocused ? 2 : 1,
        borderColor: this.props.errorMessage ? '#b00020ff' : 'black',
        paddingBottom: this.state.isFocused ? 11 : 12,
      };
      return (
        <TextInput
          style={textInputStyle}
          multiline={this.props.multiline}
          onFocus={(event: any) => {
            this.handleFocused();
            if (this.props.onFocus) {
              this.props.onFocus(event);
            }
          }}
          onBlur={(event: any) => {
            this.handleBlur();
            if (this.props.onBlur) {
              this.props.onBlur(event);
            }
          }}
          maxLength={this.props.maxLength}
          textAlignVertical="bottom"
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          keyboardType={this.props.keyboardType}
          selectTextOnFocus={this.props.selectTextOnFocus}
          value={this.props.value}
          numberOfLines={this.props.numberOfLines}
          editable={
            this.props.editable &&
            !this.props.onInputPress &&
            !this.props.disabled
          }
          autoFocus={this.props.autoFocus}
          onChangeText={async text => {
            if (this.props.onChangeText) {
              await this.props.onChangeText(text);
            }
          }}
        />
      );
    }
  }

  renderUnderlineView() {
    if (
      this.props.errorMessage ||
      this.props.required ||
      this.props.characterCount
    ) {
      return (
        <View style={styles.underlineContainer}>
          {this.renderHelperText()}
          {this.renderCharacterCounter()}
        </View>
      );
    }
  }

  renderHelperText() {
    if (this.props.errorMessage) {
      return <Text style={styles.errorText}>{this.props.errorMessage}</Text>;
    } else if (this.props.required) {
      return (
        <Text style={styles.helperText}>{'*' + I18n.t('label_required')}</Text>
      );
    }
  }

  renderCharacterCounter() {
    if (this.props.characterCount) {
      return (
        <Text style={styles.helperText}>
          {this.props.value ? this.props.value.length : 0} /{' '}
          {this.props.characterCount}
        </Text>
      );
    }
  }

  renderRightIcon() {
    let iconStyle: ImageStyle = {
      position: 'absolute',
      right: 12,
      bottom:
        this.props.errorMessage ||
        this.props.required ||
        this.props.characterCount
          ? 30
          : 14,
    };
    if (this.props.errorMessage) {
      return (
        <Image style={iconStyle} resizeMode="contain" source={IMAGES.ERROR} />
      );
    } else if (
      this.props.value &&
      (this.props.onChangeText ||
        this.props.onInputPress ||
        this.props.editable) &&
      !this.props.disabled
    ) {
      return (
        <TouchableOpacity
          style={iconStyle}
          onPress={async () => {
            if (this.props.onClearPress) {
              this.props.onClearPress();
            } else {
              if (this.props.onChangeText) {
                await this.props.onChangeText('');
              }
            }
          }}>
          <Image resizeMode="contain" source={IMAGES.CANCEL} />
        </TouchableOpacity>
      );
    }
  }
}
