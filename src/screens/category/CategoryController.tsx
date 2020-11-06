import React, {useCallback, useLayoutEffect, useState} from 'react';
import {CategoryView} from './CategoryView';
import Category from '../../entities/Category';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {ThunkAction} from 'redux-thunk';
import {AppState} from '../../store/store';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {connect} from 'react-redux';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import I18n from '../../i18n/i18n';

type CategoryControllerProps = {
  parentCategories: Category[];
  route: RouteProp<RootStackParamList, 'Category'>;
  navigation: StackNavigationProp<RootStackParamList, 'Category'>;
  saveCategory: (category: Category) => void;
};

const CategoryController = (props: CategoryControllerProps) => {
  const {parentCategories, route, navigation, saveCategory} = props;
  const {category, parentCategory} = route.params;

  const [name, setName] = useState<string>(category ? category.name : '');
  const [
    selectedParentCategory,
    setSelectedParentCategory,
  ] = useState<Category | null>(
    category ? category.parentCategory : parentCategory ? parentCategory : null,
  );
  const [nameError, setNameError] = useState(false);
  const [filteredParentCategories, setFilteredParentCategories] = useState(
    parentCategories,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t(category ? 'category_screen' : 'new_category_screen')}
        />
      ),
    });
  }, [navigation, category]);

  const showNameError = () => {
    setNameError(true);
  };

  const hideNameError = () => {
    setNameError(false);
  };

  const updateParentCategories = useCallback(
    async (query?: string) => {
      if (query) {
        setFilteredParentCategories(
          parentCategories.filter((item) =>
            I18n.t(item.name, {defaultValue: item.name})
              .toLowerCase()
              .includes(query),
          ),
        );
      } else {
        setFilteredParentCategories(parentCategories);
      }
    },
    [parentCategories],
  );

  const handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    if (name) {
      try {
        let newCategory: Category;
        if (category) {
          newCategory = category;
        } else {
          newCategory = new Category(name);
        }
        if (selectedParentCategory) {
          //todo need check parentCategory for exist
          newCategory.parentCategory = selectedParentCategory;
        }
        console.log('handle save button. category: ');
        await saveCategory(newCategory);
        navigation.goBack();
      } catch (error) {
        console.log('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    } else {
      showNameError();
    }
  };

  return (
    <CategoryView
      name={name}
      changeName={setName}
      nameError={nameError}
      hideNameError={hideNameError}
      parentCategories={filteredParentCategories}
      updateParentCategories={updateParentCategories}
      parentCategory={selectedParentCategory}
      changeParentCategory={setSelectedParentCategory}
      onSaveButtonPress={handleSaveButton}
    />
  );
};

const saveCategory = (
  category: Category,
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  let storageHandler = await StorageHandler.getInstance();
  console.log('saveCategory. category: ', category);
  await storageHandler.saveCategory(category);
  const categories = await storageHandler.getCategories({
    isValid: true,
  });
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
    categories: categories,
  });
};

const mapStateToProps = (state: AppState) => ({
  parentCategories: state.categoryReducer.categories.filter(
    (item) => !item.parentCategory,
  ),
});

export default connect(mapStateToProps, {
  saveCategory: (category: Category) => saveCategory(category),
})(CategoryController);
