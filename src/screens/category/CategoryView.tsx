import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {styles} from './styles';
import I18n from '../../i18n/i18n';
import {Input} from '../../components/input/Input';
import {COLORS} from '../../constants/colors';
import {Button} from '../../components/button/Button';
import {ModalList} from '../../components/modalList/ModalList';
import Category from '../../entities/Category';
import {CategoryListItem} from '../../components/listItems/categoryListItem/CategoryListItem';

type CategoryViewProps = {
  name: string;
  changeName: (name: string) => void;
  nameError: boolean;
  hideNameError: () => void;

  parentCategories: Category[];
  updateParentCategories: (query: string) => Promise<void>;

  parentCategory: Category | null;
  changeParentCategory: (category: Category | null) => void;

  onSaveButtonPress: () => Promise<void>;
};

export const CategoryView = (props: CategoryViewProps) => {
  const {
    name,
    changeName,
    nameError,
    hideNameError,
    parentCategories,
    updateParentCategories,
    parentCategory,
    changeParentCategory,
    onSaveButtonPress,
  } = props;

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const showCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const hideCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const handleSelectParentCategory = (category: Category) => {
    changeParentCategory(category);
    hideCategoryModal();
  };

  const handleClearParentCategoryPress = () => {
    changeParentCategory(null);
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
              onChangeText={changeName}
              placeholder={I18n.t('placeholder_write_name')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_parent_category')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={showCategoryModal}
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
          onPress={onSaveButtonPress}
        />
      </SafeAreaView>
      <ModalList<Category>
        data={parentCategories}
        selectedItem={parentCategory}
        visible={categoryModalVisible}
        onSwipeComplete={hideCategoryModal}
        onBackdropPress={hideCategoryModal}
        onSelectItem={handleSelectParentCategory}
        updateDataBySearchQuery={updateParentCategories}
        renderItem={renderCategoryListItem}
      />
    </View>
  );
};

const renderCategoryListItem = (
  item: Category,
  onPress: (item: Category) => void,
  isSelected: boolean,
) => {
  return (
    <CategoryListItem item={item} onPress={onPress} isSelected={isSelected} />
  );
};
