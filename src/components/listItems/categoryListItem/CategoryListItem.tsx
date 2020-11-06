import React from 'react';
import Category from '../../../entities/Category';
import {TouchableWithoutFeedback, View, Text} from 'react-native';
import {styles} from './styles';
import {Button} from '../../button/Button';
import {COLORS} from '../../../constants/colors';
import I18n from '../../../i18n/i18n';

type CategoryListItemProps = {
  item: Category;
  onPress: (item: Category) => void;
  isSelected?: boolean;
};

export const CategoryListItem = (props: CategoryListItemProps) => {
  const {item, onPress, isSelected} = props;

  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.mainContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {I18n.t(item.name, {defaultValue: item.name})}
          </Text>
        </View>
        <Button
          style={styles.button}
          height={34}
          label={isSelected ? 'Выбрано' : 'Выбрать'}
          onPress={handlePress}
          color={isSelected ? COLORS.SECONDARY_2 : COLORS.BACKGROUND_1}
          textColor={isSelected ? 'white' : COLORS.SECONDARY_DARK_1}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
