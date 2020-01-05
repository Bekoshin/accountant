import styles from './category.styles';
import React, {PureComponent} from 'react';
import {ScrollView, Text, View} from 'react-native';
import Category from '../../../../entities/Category';
import {TouchableRipple} from 'react-native-paper';
import ChildCategoryComponent from './childCategory/childCategory.component';
import I18n from '../../../../i18n/i18n';

interface CategoryProps {
  category: Category;
  navigateToCategory: (category: Category) => void;
}

export default class CategoryComponent extends PureComponent<CategoryProps> {
  render() {
    const {category} = this.props;
    return (
      <TouchableRipple onPress={() => this.props.navigateToCategory(category)}>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Text>{I18n.t(category.name, {defaultValue: category.name})}</Text>
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
      </TouchableRipple>
    );
  }

  renderChildCategories(categories: Category[] | null) {
    let categoriesComponent = [];
    if (categories) {
      for (let category of categories) {
        categoriesComponent.push(
          <ChildCategoryComponent category={category} key={category.id} />,
        );
      }
    }
    categoriesComponent.push(<ChildCategoryComponent key={-1} />);
    return categoriesComponent;
  }
}
