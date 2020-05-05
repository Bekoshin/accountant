import React, {useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import {Divider, Appbar} from 'react-native-paper';
import Category from '../../entities/Category';
import {CategoryComponent} from '../../components/category/category.component';
import I18n from '../../i18n/i18n';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';

type CategoriesProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Categories'>;
  route: RouteProp<RootStackParamList, 'Categories'>;
  categories: Category[];

  deleteCategories: (category: Category[]) => void;
};

const CategoriesScreen = (props: CategoriesProps) => {
  const {navigation, route, categories, deleteCategories} = props;
  const {canSetSeveralCategory, previousScreen} = route.params;

  const [selectedCategories, setSelectedCategories] = useState(
    route.params.selectedCategories || [],
  );

  const dropSelectedCategories = () => {
    setSelectedCategories([]);
  };

  const handleAddCategoryButton = (parentCategory?: Category) => {
    navigation.navigate('Category', {parentCategory: parentCategory});
  };

  const handleConfirmSelectButton = () => {
    navigation.navigate('Filters', {selectedCategories: selectedCategories});
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate(previousScreen, {selectedCategory: category});
  };

  const handleDeleteButton = () => {
    const message = createMessageForDeleteCategory();
    Alert.alert(I18n.t('label_deleting'), message, [
      {
        text: I18n.t('action_cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          console.log('CATEGORIES FOR DELETE: ', selectedCategories);
          deleteCategories(selectedCategories);
          dropSelectedCategories();
        },
      },
    ]);
  };

  const createMessageForDeleteCategory = (): string => {
    let message: string;
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

  const navigateToCategory = (category: Category) => {
    navigation.navigate('Category', {category: category});
  };

  const selectCategory = (category: Category) => {
    console.log('SELECTED CATEGORY: ', category);
    let tempSelectedCategories: Category[];
    if (category.isParentCategory()) {
      tempSelectedCategories = selectAllUnselectedChildCategoriesOfCategory(
        category,
      );
    } else {
      tempSelectedCategories = selectedCategories;
    }
    setSelectedCategories([...tempSelectedCategories, category]);
    console.log('SELECTED CATEGORIES: ', selectedCategories);
  };

  const selectAllUnselectedChildCategoriesOfCategory = (
    category: Category,
  ): Category[] => {
    let newSelectedCategories = [...selectedCategories];
    if (category.childCategories) {
      for (let childCategory of category.childCategories) {
        if (
          childCategory.isValid &&
          !selectedCategories.find(item => item.id === childCategory.id)
        ) {
          newSelectedCategories = [...newSelectedCategories, childCategory];
        }
      }
    }
    return newSelectedCategories;
  };

  const unselectCategory = (category: Category) => {
    let newSelectedCategories: Category[] = [...selectedCategories];
    let index = newSelectedCategories.findIndex(
      item => item.id === category.id,
    );
    if (index !== -1) {
      newSelectedCategories.splice(index, 1);
      if (category.parentCategory) {
        index = newSelectedCategories.findIndex(
          item =>
            category.parentCategory && item.id === category.parentCategory.id,
        );
        if (index !== -1) {
          newSelectedCategories.splice(index, 1);
        }
      }
      setSelectedCategories(newSelectedCategories);
    }
  };

  const AppBarComponent = () => {
    if (selectedCategories.length > 0 || canSetSeveralCategory) {
      return <SelectAppBar />;
    } else {
      return <MainAppBar />;
    }
  };

  const MainAppBar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={I18n.t('categories_screen')} />
        <Appbar.Action icon="plus" onPress={() => handleAddCategoryButton()} />
      </Appbar.Header>
    );
  };

  const SelectAppBar = () => {
    return (
      <Appbar.Header>
        {selectedCategories.length > 0 ? (
          <Appbar.Action icon="close" onPress={dropSelectedCategories} />
        ) : (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}
        <Appbar.Content
          title={selectedCategories.length + ' ' + I18n.t('label_selected')}
        />
        {selectedCategories.length === 1 && !selectedCategories[0].isDefault ? (
          <Appbar.Action
            icon="pencil"
            onPress={() => navigateToCategory(selectedCategories[0])}
          />
        ) : null}
        {selectedCategories.length > 0 ? (
          <Appbar.Action icon="delete" onPress={handleDeleteButton} />
        ) : null}
        {canSetSeveralCategory ? (
          <Appbar.Action icon="check" onPress={handleConfirmSelectButton} />
        ) : null}
      </Appbar.Header>
    );
  };

  const Categories = () => {
    let categoryComponents = [];
    for (let category of categories) {
      if (category.isParentCategory()) {
        categoryComponents.push(
          <View key={category.id}>
            <CategoryComponent
              category={category}
              setCategory={handleCategoryPress}
              selectCategory={selectCategory}
              unselectCategory={unselectCategory}
              selectedCategories={selectedCategories}
              onlySelectMode={canSetSeveralCategory}
              addCategory={handleAddCategoryButton}
            />
            <Divider />
          </View>,
        );
      }
    }
    return <View>{categoryComponents}</View>;
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
      <AppBarComponent />
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Categories />
      </ScrollView>
    </View>
  );
};

const deleteCategories = (
  categories: Category[],
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.initCategoryRepo();
  await storageHandler.markCategoriesInvalid(categories);
  const updatedCategories = await storageHandler.getAllValidCategories();
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
    categories: updatedCategories,
  });
};

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

const mapDispatchToProps = {
  deleteCategories: (categories: Category[]) => deleteCategories(categories),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoriesScreen);
