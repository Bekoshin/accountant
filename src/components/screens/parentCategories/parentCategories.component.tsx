import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button, TextInput, List, Divider} from 'react-native-paper';
import Category from '../../../entities/Category';

export interface ParentCategoriesProps {
  navigation: any;
  categories: Category[];
}

class ParentCategoriesScreen extends React.PureComponent<
  ParentCategoriesProps
> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Родительские категории',
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
      if (category.childCategories && category.childCategories.length > 0) {
        parentCategoryComponents.push(
          <View key={category.id}>
            <Text>{category.name}</Text>
            <Divider />
          </View>,
        );
      }
    }
    return parentCategoryComponents;
  }
}

const mapStateToProps = (state: AppState) => ({
  categories: state.category.categories,
});

export default connect(
  mapStateToProps,
  {},
)(ParentCategoriesScreen);
