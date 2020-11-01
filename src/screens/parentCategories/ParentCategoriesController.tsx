import React, {useLayoutEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import Category from '../../entities/Category';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import I18n from '../../i18n/i18n';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import {ParentCategoriesView} from './ParentCategoriesView';

type ParentCategoriesControllerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ParentCategories'>;
  categories: Category[];
};

const ParentCategoriesController = (props: ParentCategoriesControllerProps) => {
  const {navigation, categories} = props;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t('parent_categories_screen')}
        />
      ),
    });
  }, [navigation]);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Category', {selectedParentCategory: category});
  };

  return (
    <ParentCategoriesView
      categories={categories}
      onCategoryPress={handleCategoryPress}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories.filter(
    (item) => !item.parentCategory,
  ),
});

export default connect(mapStateToProps, {})(ParentCategoriesController);
