import styles from './childCategory.styles';
import React, {PureComponent} from 'react';
import {Text, View, Image} from 'react-native';
import I18n from '../../../../../i18n/i18n';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../../../../entities/Category';
import IMAGES from '../../../../../images';

interface ChildCategoryProps {
  category?: Category;
  onPress: (category: Category) => void;
  selectMode?: boolean;
  onSelectPress?: (category: Category) => void;
}

interface ChildCategoryState {
  isSelected: boolean;
}

export default class ChildCategoryComponent extends PureComponent<
  ChildCategoryProps,
  ChildCategoryState
> {
  state = {
    isSelected: false,
  };

  onPressHandler = () => {
    const {category, onPress, selectMode, onSelectPress} = this.props;
    if (category) {
      if (selectMode) {
        if (onSelectPress) {
          onSelectPress(category);
        }
      } else {
        onPress(category);
      }
    }
  };

  render() {
    const {isSelected} = this.state;
    let contentStyle = {
      ...styles.contentContainer,
      backgroundColor: isSelected ? '#00000033' : 'transparent',
    };
    return (
      <TouchableRipple
        style={styles.touchableContainer}
        onPress={this.onPressHandler}>
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
    const {isSelected} = this.state;
    if (isSelected) {
      return (
        <View style={{position: 'absolute', right: 4, top: 4}}>
          <Image resizeMode="contain" source={IMAGES.CHECK} />
        </View>
      );
    }
  }
}
