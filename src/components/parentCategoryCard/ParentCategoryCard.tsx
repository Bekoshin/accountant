import styles from './styles';
import React from 'react';
import {ScrollView, Text, TouchableHighlight, View} from 'react-native';
import Category from '../../entities/Category';
import {ChildCategoryCard} from '../childCategoryCard/ChildCategoryCard';
import I18n from '../../i18n/i18n';
import {CheckIcon} from '../checkIcon/checkIcon';
import {COLORS} from '../../constants/colors';

type ParentCategoryCardProps = {
  category: Category;
  setCategory: (category: Category) => void;
  selectCategory: (category: Category) => void;
  unselectCategory: (category: Category) => void;
  addCategory: (category?: Category) => void;
  selectedCategories: Category[];
  onlySelectMode: boolean;
};

export const ParentCategoryCard = (props: ParentCategoryCardProps) => {
  const {
    category,
    addCategory,
    selectCategory,
    unselectCategory,
    selectedCategories,
    onlySelectMode,
    setCategory,
  } = props;

  const checkIsSelected = (checkableCategory: Category): boolean => {
    let foundCategory = selectedCategories.find(
      (item) => item.id === checkableCategory.id,
    );
    return !!foundCategory;
  };

  const checkIsSelectMode = (): boolean => {
    return selectedCategories.length > 0 || onlySelectMode;
  };

  const isSelected = checkIsSelected(category);
  const isSelectMode = checkIsSelectMode();

  const handlePress = (categoryIsSelected: boolean) => {
    if (isSelectMode) {
      if (categoryIsSelected) {
        return unselectCategory;
      } else {
        return selectCategory;
      }
    } else {
      return setCategory;
    }
  };

  const handleLongPress = () => {
    if (!checkIsSelectMode()) {
      return selectCategory;
    } else {
      return () => {};
    }
  };

  const touchableStyle = {
    backgroundColor: isSelected ? '#00000033' : 'transparent',
  };

  const renderChildCategories = () => {
    let categoriesComponent = [];
    if (category.childCategories) {
      for (let childCategory of category.childCategories) {
        if (childCategory.isValid) {
          childCategory.parentCategory = category; //todo maybe need change
          const childCategoryIsSelected = checkIsSelected(childCategory);
          categoriesComponent.push(
            <ChildCategoryCard
              category={childCategory}
              key={childCategory.id}
              onPress={handlePress(childCategoryIsSelected)}
              onLongPress={handleLongPress()}
              isSelected={childCategoryIsSelected}
              selectMode={isSelectMode}
            />,
          );
        }
      }
    }
    categoriesComponent.push(
      <ChildCategoryCard
        onAddPress={() => {
          addCategory(category);
        }}
        key={-1}
      />,
    );
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {categoriesComponent}
      </ScrollView>
    );
  };

  return (
    <TouchableHighlight
      style={touchableStyle}
      onPress={() => handlePress(isSelected)(category)}
      onLongPress={() => handleLongPress()(category)}
      activeOpacity={0.9}
      underlayColor={COLORS.OUTLINE}>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.parenCategoryName}>
              {I18n.t(category.name, {defaultValue: category.name})}
            </Text>
          </View>
          {renderChildCategories()}
        </View>
        <CheckIcon isSelected={isSelected} />
      </View>
    </TouchableHighlight>
  );
};
