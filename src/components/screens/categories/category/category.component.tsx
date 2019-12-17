import styles from './category.styles';
import React, {PureComponent} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Category from '../../../../entities/Category';
import ChildCategoryComponent from './childCategory/childCategory.component';

interface CategoryProps {
  category: Category;
}

export default class CategoryComponent extends PureComponent<CategoryProps> {
  render() {
    const {category} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text>{category.name}</Text>
        </View>
        <ScrollView horizontal={true}>
          {this.renderChildCategories(category.childCategories)}
        </ScrollView>
      </View>
    );
  }

  renderChildCategories(categories: Category[] | null) {
    let categoriesComponent = [];
    if (categories) {
      for (let category of categories) {
        categoriesComponent.push(
          <ChildCategoryComponent category={category} />,
        );
      }
    }
    categoriesComponent.push(<ChildCategoryComponent />);
    return categoriesComponent;
  }
}
