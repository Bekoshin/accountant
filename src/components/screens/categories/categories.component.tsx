import React from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Divider, Appbar} from 'react-native-paper';
import Category from '../../../entities/Category';
import CategoryComponent from './category/category.component';
import I18n from '../../../i18n/i18n';

interface CategoriesProps {
  navigation: any;
  categories: Category[];
}

interface CategoriesState {
  selectedCategories: Category[];
}

class CategoriesScreen extends React.PureComponent<
  CategoriesProps,
  CategoriesState
> {
  private setCategory: (
    category: Category,
  ) => void = this.props.navigation.getParam('setCategory');
  private setCategories: (
    category: Category[],
  ) => void = this.props.navigation.getParam('setCategories');

  private handleCategoryPress = (category: Category) => {
    this.setCategory(category);
    this.props.navigation.goBack();
  };
  private handleConfirmSelectButton = () => {
    const {selectedCategories} = this.state;
    this.setCategories(selectedCategories);
    this.props.navigation.goBack();
  };

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    selectedCategories: [],
  };

  dropSelectedCategories = () => {
    this.setState({selectedCategories: []});
  };

  selectCategory = (category: Category) => {
    this.setState({
      selectedCategories: [...this.state.selectedCategories, category],
    });
  };

  unselectCategory = (category: Category) => {
    let selectedCategories: Category[] = [...this.state.selectedCategories];
    const index = selectedCategories.findIndex(item => item.id === category.id);
    if (index !== -1) {
      selectedCategories.splice(index, 1);
      this.setState({selectedCategories: selectedCategories});
    }
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
        {this.renderAppBar()}
        <ScrollView
          style={{flex: 1}}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {this.renderCategories()}
        </ScrollView>
      </View>
    );
  }

  renderAppBar() {
    const {selectedCategories} = this.state;
    if (selectedCategories.length > 0) {
      return this.renderSelectAppBar();
    } else {
      return this.renderMainAppBar();
    }
  }

  renderMainAppBar() {
    const {navigation} = this.props;
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={I18n.t('categories_screen')} />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate('Category');
          }}
        />
      </Appbar.Header>
    );
  }

  renderSelectAppBar() {
    const {navigation} = this.props;
    const selectedCategories: Category[] = this.state.selectedCategories;
    return (
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={this.dropSelectedCategories} />
        <Appbar.Content
          title={selectedCategories.length + ' ' + I18n.t('label_selected')}
        />
        {selectedCategories.length === 1 && !selectedCategories[0].isDefault ? (
          <Appbar.Action
            icon="pencil"
            onPress={() => this.navigateToCategory(selectedCategories[0])}
          />
        ) : null}
        <Appbar.Action icon="delete" onPress={() => {}} />
        <Appbar.Action icon="check" onPress={this.handleConfirmSelectButton} />
      </Appbar.Header>
    );
  }

  renderCategories() {
    const {categories} = this.props;
    const {selectedCategories} = this.state;
    let categoryComponents = [];
    for (let category of categories) {
      if (!category.parentCategory) {
        console.log('category: ', category);
        categoryComponents.push(
          <View key={category.id}>
            <CategoryComponent
              category={category}
              setCategory={this.handleCategoryPress}
              selectCategory={this.selectCategory}
              unselectCategory={this.unselectCategory}
              selectedCategories={selectedCategories}
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
