import React from 'react';
import {ScrollView, View} from 'react-native';
import {styles} from './styles';
import {Button} from '../../components/button/Button';
import I18n from '../../i18n/i18n';
import {ParentCategoryCard} from '../../components/parentCategoryCard/ParentCategoryCard';
import {Divider} from 'react-native-paper';
import Category from '../../entities/Category';

type CategoriesViewProps = {
  categories: Category[];
  selectedCategories: Category[];
  canSetSeveralCategories: boolean;
  onCategoryPress: (category: Category) => void;
  selectCategory: (category: Category) => void;
  unselectCategory: (category: Category) => void;
  onAddCategoryButtonPress: (category?: Category) => void;
  onConfirmSelectButtonPress: () => void;
};

export const CategoriesView = (props: CategoriesViewProps) => {
  const {
    categories,
    selectedCategories,
    canSetSeveralCategories,
    onCategoryPress,
    selectCategory,
    unselectCategory,
    onAddCategoryButtonPress,
    onConfirmSelectButtonPress,
  } = props;

  const renderCategories = () => {
    let categoryComponents = [];
    for (let category of categories) {
      if (category.isParentCategory()) {
        categoryComponents.push(
          <View key={category.id}>
            <ParentCategoryCard
              category={category}
              setCategory={onCategoryPress}
              selectCategory={selectCategory}
              unselectCategory={unselectCategory}
              selectedCategories={selectedCategories}
              onlySelectMode={canSetSeveralCategories}
              addCategory={onAddCategoryButtonPress}
            />
            <Divider />
          </View>,
        );
      }
    }
    return <View>{categoryComponents}</View>;
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {renderCategories()}
      </ScrollView>
      {canSetSeveralCategories ? (
        <Button
          style={styles.saveButton}
          label={I18n.t('action_confirm')}
          onPress={onConfirmSelectButtonPress}
        />
      ) : null}
    </View>
  );
};
