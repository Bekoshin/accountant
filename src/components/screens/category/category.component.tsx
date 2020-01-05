import React from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button} from 'react-native-paper';
import Category from '../../../entities/Category';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import StorageHandler from '../../../storage/StorageHandler';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {actionTypes} from '../../../store/actionTypes';

interface CategoryProps {
  navigation: any;
  category?: Category;
  categories: Category[];

  saveCategory: (category: Category) => Promise<void>;
}

interface CategoryState {
  name: string;
  parentCategory: Category | null;
  nameError: string;
}

class CategoryScreen extends React.PureComponent<CategoryProps, CategoryState> {
  state = {
    name: this.props.category ? this.props.category.name : '',
    parentCategory: this.props.category
      ? this.props.category.parentCategory
      : null,
    nameError: '',
  };

  static navigationOptions = ({navigation}: any) => {
    let params = navigation.state.params;
    console.log('params: ', params);
    return {
      title: I18n.t(
        params && params.category ? 'category_screen' : 'new_category_screen',
      ),
      headerRight: () => (
        <Button onPress={() => params.saveButtonHandler()}>
          {I18n.t('action_save')}
        </Button>
      ),
    };
  };

  handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    const {name, parentCategory} = this.state;
    if (name) {
      let category;
      if (parentCategory) {
        //todo need check parentCategory for exist
        category = new Category(name, parentCategory);
      } else {
        category = new Category(name);
      }
      await this.props.saveCategory(category);
    }
  };

  showNameError = () => {
    this.setState({nameError: I18n.t('label_required')});
  };

  hideNameError = () => {
    this.setState({nameError: ''});
  };

  changeParentCategory = (category: Category) => {
    this.setState({parentCategory: category});
  };

  changeCategoryName = (name: string) => {
    this.setState({name: name});
  };

  componentDidMount(): void {
    this.props.navigation.setParams({saveButtonHandler: this.handleSaveButton});
    console.log('CATEGORY DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORY WILL UNMOUNT');
  }

  render() {
    const {name, parentCategory} = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
        <ScrollView>
          <Input
            label="Наименование"
            value={name}
            required={true}
            errorMessage={this.state.nameError}
            onFocus={this.hideNameError}
            onChangeText={this.changeCategoryName}
          />
          <Input
            label="Parent category"
            value={
              parentCategory
                ? I18n.t(parentCategory.name, {
                    defaultValue: parentCategory.name,
                  })
                : ''
            }
            editable={false}
            onInputPress={() => {
              this.props.navigation.navigate('ParentCategories', {
                selectCategory: this.changeParentCategory,
              });
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const saveCategory = (
  category: Category,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.init();
  await storageHandler.saveCategoryInRepo(category);
  const categories = await storageHandler.getAllCategoriesFromRepo();
  dispatch({
    type: actionTypes.CATEGORIES_LOADED,
    categories: categories,
  });
};

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

export default connect(
  mapStateToProps,
  {
    saveCategory: (category: Category) => saveCategory(category),
  },
)(CategoryScreen);
