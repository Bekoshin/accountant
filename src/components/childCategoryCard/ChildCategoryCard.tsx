import styles from './styles';
import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckIcon} from '../checkIcon/checkIcon';
import {COLORS} from '../../constants/colors';

type ChildCategoryCardProps = {
  category?: Category;
  onPress?: (category: Category) => void;
  onLongPress?: (category: Category) => void;
  onAddPress?: () => void;
  selectMode?: boolean;
  isSelected?: boolean;
};

export const ChildCategoryCard = (props: ChildCategoryCardProps) => {
  const {category, onPress, onLongPress, onAddPress, isSelected} = props;

  const handlePress = () => {
    if (category && onPress) {
      onPress(category);
    } else if (onAddPress) {
      onAddPress();
    }
  };

  const handleLongPress = () => {
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
      return <Icon name={iconName} size={48} color={COLORS.PRIMARY} />;
    }
  };

  return (
    <TouchableHighlight
      style={styles.touchableContainer}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.9}
      underlayColor={COLORS.OUTLINE}>
      <View style={contentStyle}>
        {renderContent()}
        <CheckIcon isSelected={isSelected} />
      </View>
    </TouchableHighlight>
  );
};
