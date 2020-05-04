import styles from './category.styles';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import Category from '../../entities/Category';
import {TouchableRipple} from 'react-native-paper';
import {ChildCategoryComponent} from '../childCategory/childCategory.component';
import I18n from '../../i18n/i18n';
import {CheckIcon} from '../checkIcon/checkIcon.component';

type CategoryProps = {
  category: Category;
  setCategory: (category: Category) => void;
  selectCategory: (category: Category) => void;
  unselectCategory: (category: Category) => void;
  addCategory: (category?: Category) => void;
  selectedCategories: Category[];
  onlySelectMode: boolean;
};

export const CategoryComponent = (props: CategoryProps) => {
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
      item => item.id === checkableCategory.id,
    );
    return !!foundCategory;
  };

  const checkIsSelectMode = (): boolean => {
    return selectedCategories.length > 0 || onlySelectMode;
  };

  const isSelected = checkIsSelected(category);
  const isSelectMode = checkIsSelectMode();

  const onPressHandle = (categoryIsSelected: boolean) => {
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

  const onLongPressHandle = () => {
    if (!checkIsSelectMode()) {
      return selectCategory;
    } else {
      return () => {};
    }
  };

  const touchableStyle = {
    backgroundColor: isSelected ? '#00000033' : 'transparent',
  };

  const ChildCategories = () => {
    let categoriesComponent = [];
    if (category.childCategories) {
      for (let childCategory of category.childCategories) {
        if (childCategory.isValid) {
          childCategory.parentCategory = category; //todo maybe need change
          const childCategoryIsSelected = checkIsSelected(childCategory);
          categoriesComponent.push(
            <ChildCategoryComponent
              category={childCategory}
              key={childCategory.id}
              onPress={onPressHandle(childCategoryIsSelected)}
              onLongPress={onLongPressHandle()}
              isSelected={childCategoryIsSelected}
              selectMode={isSelectMode}
            />,
          );
        }
      }
    }
    categoriesComponent.push(
      <ChildCategoryComponent
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
    <TouchableRipple
      style={touchableStyle}
      onPress={() => onPressHandle(isSelected)(category)}
      onLongPress={() => onLongPressHandle()(category)}>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text>{I18n.t(category.name, {defaultValue: category.name})}</Text>
          </View>
          <ChildCategories />
        </View>
        <CheckIcon isSelected={isSelected} />
      </View>
    </TouchableRipple>
  );
};
