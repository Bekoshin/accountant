import styles from './category.styles';
import React, {PureComponent} from 'react';
import {ScrollView, Text, View} from 'react-native';
import Category from '../../entities/Category';
import {TouchableRipple} from 'react-native-paper';
import ChildCategoryComponent from '../childCategory/childCategory.component';
import I18n from '../../i18n/i18n';
import CheckIcon from '../checkIcon/checkIcon.Component';

interface CategoryProps {
  category: Category;
  setCategory: (category: Category) => void;
  selectCategory: (category: Category) => void;
  unselectCategory: (category: Category) => void;
  addCategory: (category?: Category) => void;
  selectedCategories: Category[];
  onlySelectMode: boolean;
}

export default class CategoryComponent extends PureComponent<CategoryProps> {
  render() {
    const {category} = this.props;
    const isSelected = this.isSelected(category);
    const touchableStyle = {
      backgroundColor: isSelected ? '#00000033' : 'transparent',
    };
    return (
      <TouchableRipple
        style={touchableStyle}
        onPress={() => this.onPressHandle(isSelected)(category)}
        onLongPress={() => this.onLongPressHandle()(category)}>
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text>
                {I18n.t(category.name, {defaultValue: category.name})}
              </Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              {this.renderChildCategories(category.childCategories)}
            </ScrollView>
          </View>
          {this.renderCheckIcon()}
        </View>
      </TouchableRipple>
    );
  }

  renderChildCategories(categories: Category[] | null) {
    const {category, addCategory} = this.props;
    let categoriesComponent = [];
    if (categories) {
      for (let category of categories) {
        if (category.isValid) {
          category.parentCategory = this.props.category; //todo maybe need change
          const isSelected = this.isSelected(category);
          categoriesComponent.push(
            <ChildCategoryComponent
              category={category}
              key={category.id}
              onPress={this.onPressHandle(isSelected)}
              onLongPress={this.onLongPressHandle()}
              isSelected={isSelected}
              selectMode={this.isSelectMode()}
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
    return categoriesComponent;
  }

  renderCheckIcon() {
    const {category} = this.props;
    const isSelected = this.isSelected(category);
    return CheckIcon(isSelected);
  }

  onPressHandle = (isSelected: boolean) => {
    if (this.isSelectMode()) {
      if (isSelected) {
        return this.props.unselectCategory;
      } else {
        return this.props.selectCategory;
      }
    } else {
      return this.props.setCategory;
    }
  };

  onLongPressHandle = () => {
    console.log('onLongPressHandle parent');
    if (!this.isSelectMode()) {
      return this.props.selectCategory;
    } else {
      return () => {};
    }
  };

  isSelected = (category: Category): boolean => {
    const {selectedCategories} = this.props;
    let foundCategory = selectedCategories.find(
      item => item.id === category.id,
    );
    return !!foundCategory;
  };

  isSelectMode = (): boolean => {
    return (
      this.props.selectedCategories.length > 0 || this.props.onlySelectMode
    );
  };
}
