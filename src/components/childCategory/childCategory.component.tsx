import styles from './childCategory.styles';
import React from 'react';
import {Text, View, Image} from 'react-native';
import I18n from '../../i18n/i18n';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../entities/Category';
import IMAGES from '../../images';
import {CheckIcon} from '../checkIcon/checkIcon.component';

type ChildCategoryProps = {
  category?: Category;
  onPress?: (category: Category) => void;
  onLongPress?: (category: Category) => void;
  onAddPress?: () => void;
  selectMode?: boolean;
  isSelected?: boolean;
};

export const ChildCategoryComponent = (props: ChildCategoryProps) => {
  const {category, onPress, onLongPress, onAddPress, isSelected} = props;

  const onPressHandle = () => {
    if (category && onPress) {
      onPress(category);
    } else if (onAddPress) {
      onAddPress();
    }
  };

  const onLongPressHandle = () => {
    console.log('onLongPressHandle child');
    if (category && onLongPress) {
      onLongPress(category);
    }
  };

  const contentStyle = {
    ...styles.contentContainer,
    backgroundColor: isSelected ? '#00000033' : 'transparent',
  };

  const renderContent = () => {
    if (category) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {renderIcon(category.image)}
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
          {renderIcon(IMAGES.ADD)}
          <Text style={styles.headerText}>Добавить</Text>
        </View>
      );
    }
  };

  const renderIcon = (source: number | undefined) => {
    if (source) {
      return <Image source={source} style={{width: 40, height: 40}} />;
    }
  };

  return (
    <TouchableRipple
      style={styles.touchableContainer}
      onPress={onPressHandle}
      onLongPress={onLongPressHandle}>
      <View style={contentStyle}>
        {renderContent()}
        <CheckIcon isSelected={isSelected} />
      </View>
    </TouchableRipple>
  );
};
