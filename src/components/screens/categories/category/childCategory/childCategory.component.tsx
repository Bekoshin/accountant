import styles from './childCategory.styles';
import React, {PureComponent} from 'react';
import {Text, View, Image} from 'react-native';
import I18n from '../../../../../i18n/i18n';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../../../../entities/Category';
import IMAGES from '../../../../../images';
import CheckIcon from '../../../../checkIcon/checkIcon.Component';

interface ChildCategoryProps {
  category?: Category;
  onPress?: (category: Category) => void;
  onLongPress?: (category: Category) => void;
  selectMode?: boolean;
  isSelected?: boolean;
}

export default class ChildCategoryComponent extends PureComponent<
  ChildCategoryProps
> {
  onPressHandle = () => {
    const {category, onPress} = this.props;
    if (category && onPress) {
      onPress(category);
    }
  };
  onLongPressHandle = () => {
    console.log('onLongPressHandle child')
    const {category, onLongPress} = this.props;
    if (category && onLongPress) {
      onLongPress(category);
    }
  };

  render() {
    const {isSelected} = this.props;
    let contentStyle = {
      ...styles.contentContainer,
      backgroundColor: isSelected ? '#00000033' : 'transparent',
    };
    return (
      <TouchableRipple
        style={styles.touchableContainer}
        onPress={this.onPressHandle}
        onLongPress={this.onLongPressHandle}>
        <View style={contentStyle}>
          {this.renderContent()}
          {this.renderCheckIcon()}
        </View>
      </TouchableRipple>
    );
  }

  renderContent() {
    const {category} = this.props;
    if (category) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.renderIcon(category.image)}
          <Text style={styles.headerText}>
            {I18n.t(category.name, {defaultValue: category.name})}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.renderIcon(IMAGES.ADD)}
          <Text style={styles.headerText}>Добавить</Text>
        </View>
      );
    }
  }

  renderIcon(source: number | undefined) {
    if (source) {
      return <Image source={source} style={{width: 40, height: 40}} />;
    }
  }

  renderCheckIcon() {
    const {isSelected} = this.props;
    return CheckIcon(isSelected);
  }
}
