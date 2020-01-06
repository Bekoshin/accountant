import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button, Divider} from 'react-native-paper';
import Category from '../../../entities/Category';
import CategoryComponent from './category/category.component';

export interface CategoriesProps {
  navigation: any;
  categories: Category[];
}

class CategoriesScreen extends React.PureComponent<CategoriesProps> {
  private selectCategory: (
    category: Category,
  ) => void = this.props.navigation.getParam('selectCategory');
  private handleCategoryPress = (category: Category) => {
    this.selectCategory(category);
    this.props.navigation.goBack();
  };

  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Категории',
      headerRight: () => (
        <Button
          onPress={() => {
            navigation.navigate('Category');
          }}>
          Добавить
        </Button>
      ),
    };
  };

  componentDidMount(): void {
    console.log('CATEGORIES DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORIES WILL UNMOUNT');
  }

  render() {
    return (
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {this.renderCategories()}
      </ScrollView>
    );
  }

  renderCategories() {
    const {categories} = this.props;
    let categoryComponents = [];
    for (let category of categories) {
      if (!category.parentCategory) {
        console.log('category: ', category);
        categoryComponents.push(
          <View key={category.id}>
            <CategoryComponent
              category={category}
              navigateToCategory={this.navigateToCategory}
              onPress={this.handleCategoryPress}
            />
            <Divider />
          </View>,
        );
      }
    }
    return categoryComponents;
  }

  navigateToCategory = (category: Category) => {
    this.props.navigation.navigate('Category', {category: category});
  };
}

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

export default connect(
  mapStateToProps,
  {},
)(CategoriesScreen);
