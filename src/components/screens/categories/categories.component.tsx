import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button, TextInput, List} from 'react-native-paper';
import Category from '../../../entities/Category';

export interface CategoriesProps {
  navigation: any;

  categories: Category[];
}

class CategoriesScreen extends React.PureComponent<CategoriesProps> {
  static navigationOptions = {
    title: 'Категории',
    headerRight: () => <Button onPress={() => {}}>Сохранить</Button>,
  };

  componentDidMount(): void {
    console.log('CATEGORIES DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORIES WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        {this.renderCategories()}
      </View>
    );
  }

  renderCategories() {
    const {categories} = this.props;
    let categoryComponents = [];
    for (let category of categories) {
      categoryComponents.push(
        <List.Accordion title={category.name} onPress={() => console.log('test')}>
          {this.renderChildCategories(category.childCategories)}
        </List.Accordion>,
      );
    }
    return categoryComponents;
  }

  renderChildCategories(childCategories: Category[] | undefined) {
    if (childCategories) {
      let childCategoryComponents = [];
      for (let category of childCategories) {
        childCategoryComponents.push(<List.Item title={category.name} />);
      }
      return childCategoryComponents;
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  categories: state.category.categories,
});

export default connect(
  mapStateToProps,
  {},
)(CategoriesScreen);
