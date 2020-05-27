import React from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import {List, Divider} from 'react-native-paper';
import Category from '../../entities/Category';
import I18n from '../../i18n/i18n';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {GeneralAppBar} from '../../components/appBars/generalAppBar/generalAppBar';

type ParentCategoriesProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ParentCategories'>;
  categories: Category[];
};

const ParentCategoriesScreen = (props: ParentCategoriesProps) => {
  const {navigation, categories} = props;

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Category', {selectedParentCategory: category});
  };

  const renderParentCategories = () => {
    let parentCategoryComponents = [];
    for (let category of categories) {
      if (!category.parentCategory) {
        parentCategoryComponents.push(
          <View key={category.id}>
            <List.Item
              title={I18n.t(category.name, {defaultValue: category.name})}
              onPress={() => handleCategoryPress(category)}
            />
            <Divider />
          </View>,
        );
      }
    }
    return parentCategoryComponents;
  };

  return (
    <View style={{flex: 1}}>
      <GeneralAppBar
        title={I18n.t('parent_categories_screen')}
        onBackButtonPress={navigation.goBack}
      />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {renderParentCategories()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  categories: state.categoryReducer.categories,
});

export default connect(
  mapStateToProps,
  {},
)(ParentCategoriesScreen);
