import React from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {List, Divider} from 'react-native-paper';
import Category from '../../../entities/Category';
import I18n from '../../../i18n/i18n';

export interface ParentCategoriesProps {
  navigation: any;
  categories: Category[];
}

class ParentCategoriesScreen extends React.PureComponent<
  ParentCategoriesProps
> {
  private setCategory: (
    category: Category,
  ) => void = this.props.navigation.getParam('setCategory');
  private handleCategoryPress = (category: Category) => {
    this.setCategory(category);
    this.props.navigation.goBack();
  };

  static navigationOptions = () => {
    return {
      title: I18n.t('parent_categories_screen'),
    };
  };

  componentDidMount(): void {
    console.log('PARENT CATEGORIES DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('PARENT CATEGORIES WILL UNMOUNT');
  }

  render() {
    return (
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {this.renderParentCategories()}
      </ScrollView>
    );
  }

  renderParentCategories() {
    const {categories} = this.props;

    let parentCategoryComponents = [];
    for (let category of categories) {
      if (!category.parentCategory) {
        parentCategoryComponents.push(
          <View key={category.id}>
            <List.Item
              title={I18n.t(category.name, {defaultValue: category.name})}
              onPress={() => this.handleCategoryPress(category)}
            />
            <Divider />
          </View>,
        );
      }
    }
    return parentCategoryComponents;
  }
}

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

export default connect(
  mapStateToProps,
  {},
)(ParentCategoriesScreen);
