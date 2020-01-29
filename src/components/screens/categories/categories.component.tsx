import React from 'react';
import {View, ScrollView, Alert} from 'react-native';
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
  private setCategory: (category: Category) => void;
  private setCategories: (category: Category[]) => void;
  private readonly canSetSeveralCategory: boolean;

  constructor(props: CategoriesProps) {
    super(props);
    this.setCategory = this.props.navigation.getParam('setCategory');
    this.setCategories = this.props.navigation.getParam('setCategories');
    this.canSetSeveralCategory = !!this.setCategories;
    const selectedCategories = this.props.navigation.getParam(
      'selectedCategories',
    );
    this.state = {
      selectedCategories: selectedCategories ? selectedCategories : [],
    };
  }

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

  dropSelectedCategories = () => {
    this.setState({selectedCategories: []});
  };

  handleDeleteButton = () => {
    const message = this.createMessageForDeleteCategory();
    Alert.alert(I18n.t('label_deleting'), message, [
      {
        text: I18n.t('action_cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {},
      },
    ]);
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
    if (selectedCategories.length > 0 || this.canSetSeveralCategory) {
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
        {selectedCategories.length > 0 ? (
          <Appbar.Action icon="close" onPress={this.dropSelectedCategories} />
        ) : (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}
        <Appbar.Content
          title={selectedCategories.length + ' ' + I18n.t('label_selected')}
        />
        {selectedCategories.length === 1 && !selectedCategories[0].isDefault ? (
          <Appbar.Action
            icon="pencil"
            onPress={() => this.navigateToCategory(selectedCategories[0])}
          />
        ) : null}
        {selectedCategories.length > 0 ? (
          <Appbar.Action icon="delete" onPress={this.handleDeleteButton} />
        ) : null}
        {this.canSetSeveralCategory ? (
          <Appbar.Action
            icon="check"
            onPress={this.handleConfirmSelectButton}
          />
        ) : null}
      </Appbar.Header>
    );
  }

  renderCategories() {
    const {categories} = this.props;
    const {selectedCategories} = this.state;
    let categoryComponents = [];
    for (let category of categories) {
      if (!category.parentCategory) {
        categoryComponents.push(
          <View key={category.id}>
            <CategoryComponent
              category={category}
              setCategory={this.handleCategoryPress}
              selectCategory={this.selectCategory}
              unselectCategory={this.unselectCategory}
              selectedCategories={selectedCategories}
              onlySelectMode={this.canSetSeveralCategory}
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

  createMessageForDeleteCategory = (): string => {
    let message: string;
    const {selectedCategories} = this.state;
    if (selectedCategories.length === 1) {
      const selectedCategory = selectedCategories[0];
      message =
        I18n.t('message_delete_category') +
        ' "' +
        I18n.t(selectedCategory.name, {
          defaultValue: selectedCategory.name,
        }) +
        '" ?';
      if (
        selectedCategory.childCategories &&
        selectedCategory.childCategories.length > 0
      ) {
        message += ' ' + I18n.t('message_child_categories_delete') + '.';
      }
    } else {
      message =
        I18n.t('message_delete_categories') +
        '? ' +
        I18n.t('message_child_categories_delete') +
        '.';
    }
    return message;
  };
}

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

export default connect(
  mapStateToProps,
  {},
)(CategoriesScreen);
