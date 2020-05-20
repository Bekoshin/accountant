import React, {useEffect, useState} from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Category from '../../entities/Category';
import Input from '../../components/input/input';
import I18n from '../../i18n/i18n';
import StorageHandler from '../../storage/StorageHandler';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {GeneralAppBar} from '../../components/appBars/generalAppBar/generalAppBar.component';

type CategoryScreenProps = {
  route: RouteProp<RootStackParamList, 'Category'>;
  navigation: StackNavigationProp<RootStackParamList, 'Category'>;
  saveCategory: (category: Category) => void;
};

const CategoryScreen = (props: CategoryScreenProps) => {
  const {navigation, route, saveCategory} = props;
  const params = route.params;
  const {category, selectedParentCategory} = params;
  console.log('params: ', params);

  const [name, setName] = useState<string>(category ? category.name : '');
  const [parentCategory, setParentCategory] = useState<Category | null>(
    category
      ? category.parentCategory
      : params.parentCategory
      ? params.parentCategory
      : null,
  );
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (selectedParentCategory) {
      setParentCategory(selectedParentCategory);
    }
  }, [selectedParentCategory]);

  const showNameError = () => {
    setNameError(I18n.t('label_required'));
  };

  const hideNameError = () => {
    setNameError('');
  };

  const handleParentCategoryInputPress = () => {
    navigation.navigate('ParentCategories');
  };

  const handleClearParentCategoryPress = () => {
    setParentCategory(null);
  };

  const handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    if (name) {
      try {
        let newCategory: Category;
        if (params.category) {
          newCategory = params.category;
        } else {
          newCategory = new Category(name);
        }
        if (parentCategory) {
          //todo need check parentCategory for exist
          newCategory.parentCategory = parentCategory;
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
    <View style={{flex: 1}}>
      <GeneralAppBar
        title={I18n.t(
          params && params.category ? 'category_screen' : 'new_category_screen',
        )}
        onBackButtonPress={navigation.goBack}
        onSaveButtonPress={handleSaveButton}
      />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
          <ScrollView>
            <Input
              label="Наименование"
              value={name}
              required={true}
              errorMessage={nameError}
              onFocus={hideNameError}
              onChangeText={setName}
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
              onInputPress={handleParentCategoryInputPress}
              onClearPress={handleClearParentCategoryPress}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const saveCategory = (
  category: Category,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = await StorageHandler.getInstance();
  console.log('saveCategory. category: ', category);
  await storageHandler.saveCategory(category);
  const categories = await storageHandler.getAllValidCategories();
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
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
