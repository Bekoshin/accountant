import React from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';
import {List, Divider} from 'react-native-paper';
import Category from '../../entities/Category';
import I18n from '../../i18n/i18n';
import {styles} from './styles';

type ParentCategoriesViewProps = {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
};

export const ParentCategoriesView = (props: ParentCategoriesViewProps) => {
  const {categories, onCategoryPress} = props;

  const renderCategory = ({item}: {item: Category}) => {
    const handleCategoryPress = () => {
      onCategoryPress(item);
    };
    return (
      <View>
        <List.Item
          title={I18n.t(item.name, {defaultValue: item.name})}
          onPress={handleCategoryPress}
        />
        <Divider />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => (item.id as number).toString()}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </View>
  );
};
