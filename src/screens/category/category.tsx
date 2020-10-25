import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Category from '../../entities/Category';
import {Input} from '../../components/input/Input';
import I18n from '../../i18n/i18n';
import StorageHandler from '../../storage/StorageHandler';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {styles} from './styles';
import {COLORS} from '../../constants/colors';
import {Button} from '../../components/button/Button';
import {Header} from '../../components/header/Header';

type CategoryScreenProps = {
  route: RouteProp<RootStackParamList, 'Category'>;
  navigation: StackNavigationProp<RootStackParamList, 'Category'>;
  saveCategory: (category: Category) => void;
};

const CategoryScreen = (props: CategoryScreenProps) => {
  const {navigation, route, saveCategory} = props;
  const params = route.params;
  const {category, selectedParentCategory} = params;

  const [name, setName] = useState<string>(category ? category.name : '');
  const [parentCategory, setParentCategory] = useState<Category | null>(
    category
      ? category.parentCategory
      : params.parentCategory
      ? params.parentCategory
      : null,
  );
  const [nameError, setNameError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t(
            params && params.category
              ? 'category_screen'
              : 'new_category_screen',
          )}
        />
      ),
    });
  }, [navigation, params]);

  useEffect(() => {
    if (selectedParentCategory) {
      setParentCategory(selectedParentCategory);
    }
  }, [selectedParentCategory]);

  const showNameError = () => {
    setNameError(true);
  };

  const hideNameError = () => {
    setNameError(false);
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
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_name')}</Text>
            <Input
              value={name}
              error={nameError}
              onFocus={hideNameError}
              onChangeText={setName}
              placeholder={I18n.t('placeholder_write_name')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_parent_category')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={handleParentCategoryInputPress}
              activeOpacity={0.9}
              underlayColor={COLORS.PRIMARY_DARK}>
              <Input
                value={
                  parentCategory
                    ? I18n.t(parentCategory.name, {
                        defaultValue: parentCategory.name,
                      })
                    : ''
                }
                editable={false}
                onChangeText={() => {}}
                onClearButtonPress={handleClearParentCategoryPress}
                pointerEvents="none"
                placeholder={I18n.t('placeholder_select_parent_category')}
              />
            </TouchableHighlight>
          </View>
        </ScrollView>
        <Button
          style={styles.saveButton}
          label={I18n.t('action_save')}
          onPress={handleSaveButton}
        />
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
  const categories = await storageHandler.getCategories({
    isValid: true,
  });
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
