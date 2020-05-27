import styles from './styles';
import React from 'react';
import {Text, View} from 'react-native';
import I18n from '../../i18n/i18n';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../entities/Category';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckIcon} from '../checkIcon/checkIcon';

type ChildCategoryProps = {
  category?: Category;
  onPress?: (category: Category) => void;
  onLongPress?: (category: Category) => void;
  onAddPress?: () => void;
  selectMode?: boolean;
  isSelected?: boolean;
};

export const ChildCategory = (props: ChildCategoryProps) => {
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
          {renderIcon(category.iconName)}
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
          {renderIcon('plus')}
          <Text style={styles.headerText}>{I18n.t('action_add')}</Text>
        </View>
      );
    }
  };

  const renderIcon = (iconName: string | undefined) => {
    if (iconName) {
      return <Icon name={iconName} size={48} color="#5a03fc" />;
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
