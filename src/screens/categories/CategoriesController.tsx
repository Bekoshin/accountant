import React, {useLayoutEffect, useState} from 'react';
import {CategoriesView} from './CategoriesView';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import Category from '../../entities/Category';
import {ThunkAction} from 'redux-thunk';
import {AppState} from '../../store/store';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {connect} from 'react-redux';
import {Alert, TouchableOpacity} from 'react-native';
import I18n from '../../i18n/i18n';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import {LineAwesomeIcon} from '../../constants/LineAwesomeIconSet';
import {COLORS} from '../../constants/colors';

type CategoriesControllerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Categories'>;
  route: RouteProp<RootStackParamList, 'Categories'>;
  categories: Category[];

  deleteCategories: (category: Category[]) => void;
};

const CategoriesController = (props: CategoriesControllerProps) => {
  const {navigation, route, categories, deleteCategories} = props;
  const {previousScreen} = route.params;

  const canSetSeveralCategories = previousScreen === 'Filters';

  const [selectedCategories, setSelectedCategories] = useState(
    route.params.selectedCategories || [],
  );

  useLayoutEffect(() => {
    const handleAddCategoryAppBarButton = () => {
      navigation.navigate('Category', {});
    };

    const handleEditCategoryButton = () => {
      navigation.navigate('Category', {category: selectedCategories[0]});
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

    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t('categories_screen')}
          selectedCount={selectedCategories.length}
          selectMode={canSetSeveralCategories || selectedCategories.length > 0}
          unselectAllItems={dropSelectedCategories}>
          {!canSetSeveralCategories && selectedCategories.length === 0 ? (
            <TouchableOpacity onPress={handleAddCategoryAppBarButton}>
              <LineAwesomeIcon
                name="plus"
                size={22}
                color={COLORS.SECONDARY_DARK_1}
              />
            </TouchableOpacity>
          ) : null}
          {selectedCategories.length > 0 ? (
            <TouchableOpacity onPress={handleDeleteButton}>
              <LineAwesomeIcon
                name="trash"
                size={22}
                color={COLORS.SECONDARY_DARK_1}
              />
            </TouchableOpacity>
          ) : null}
          {selectedCategories.length === 1 &&
          !selectedCategories[0].isDefault ? (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={handleEditCategoryButton}>
              <LineAwesomeIcon
                name="pen"
                size={22}
                color={COLORS.SECONDARY_DARK_1}
              />
            </TouchableOpacity>
          ) : null}
        </Header>
      ),
    });
  }, [
    navigation,
    selectedCategories.length,
    canSetSeveralCategories,
    selectedCategories,
    deleteCategories,
  ]);

  const dropSelectedCategories = () => {
    setSelectedCategories([]);
  };

  const handleCategoryPress = (category: Category) => {
    if (previousScreen === 'Settings') {
      navigation.navigate('Category', {category: category});
    } else {
      navigation.navigate(previousScreen, {selectedCategory: category});
    }
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
          !selectedCategories.find((item) => item.id === childCategory.id)
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
      (item) => item.id === category.id,
    );
    if (index !== -1) {
      newSelectedCategories.splice(index, 1);
      if (category.parentCategory) {
        index = newSelectedCategories.findIndex(
          (item) =>
            category.parentCategory && item.id === category.parentCategory.id,
        );
        if (index !== -1) {
          newSelectedCategories.splice(index, 1);
        }
      }
      setSelectedCategories(newSelectedCategories);
    }
  };

  const handleAddCategoryButton = (parentCategory?: Category) => {
    navigation.navigate('Category', {parentCategory: parentCategory});
  };

  const handleConfirmSelectButton = () => {
    navigation.navigate('Filters', {selectedCategories: selectedCategories});
  };

  return (
    <CategoriesView
      categories={categories}
      selectedCategories={selectedCategories}
      canSetSeveralCategories={canSetSeveralCategories}
      onCategoryPress={handleCategoryPress}
      selectCategory={selectCategory}
      unselectCategory={unselectCategory}
      onAddCategoryButtonPress={handleAddCategoryButton}
      onConfirmSelectButtonPress={handleConfirmSelectButton}
    />
  );
};

const deleteCategories = (
  categories: Category[],
): ThunkAction<void, AppState, null, Action<string>> => async (dispatch) => {
  let storageHandler = await StorageHandler.getInstance();
  await storageHandler.markCategoriesInvalid(categories);
  const updatedCategories = await storageHandler.getCategories({
    isValid: true,
  });
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
)(CategoriesController);
