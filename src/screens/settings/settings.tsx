import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import I18n from '../../i18n/i18n';
import {Divider, List} from 'react-native-paper';
import StorageHandler, {DEFAULT_CATEGORIES_LENGTH} from '../../storage/StorageHandler';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import Subscription from '../../entities/Subscription';
import Operation from '../../entities/Operation';
import Category from '../../entities/Category';

type SettingsScreenProps = {
  route: RouteProp<RootStackParamList, 'Tab'>;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
  operations: Operation[];
  subscriptions: Subscription[];
  categories: Category[];
  clearAllData: () => void;
  loadCategoriesToStore: (categories: Category[]) => void;
};

const SettingsScreen = (props: SettingsScreenProps) => {
  const {
    navigation,
    operations,
    subscriptions,
    categories,
    clearAllData,
    loadCategoriesToStore,
  } = props;

  const [
    canRestoreDefaultCategories,
    setCanRestoreDefaultCategories,
  ] = useState(true);
  const [canWipeData, setCanWipeData] = useState(true);

  useEffect(() => {
    if (categories.length === 0) {
      setCanRestoreDefaultCategories(true);
    } else if (
      categories.filter(item => item.isDefault).length !==
      DEFAULT_CATEGORIES_LENGTH //todo maybe need change
    ) {
      setCanRestoreDefaultCategories(true);
    } else {
      setCanRestoreDefaultCategories(false);
    }
  }, [categories]);

  useEffect(() => {
    setCanWipeData(
      operations.length > 0 ||
        subscriptions.length > 0 ||
        categories.length > 0,
    );
  }, [categories.length, operations.length, subscriptions.length]);

  const handleCategoryManagementPress = () => {
    navigation.navigate('Categories', {
      previousScreen: 'Settings',
    });
  };

  const handleSubscriptionManagementPress = () => {
    navigation.navigate('Subscriptions');
  };

  const handleRestoreDefaultCategoriesPress = async () => {
    try {
      const storageHandler: StorageHandler = await StorageHandler.getInstance();
      const defaultCategories = StorageHandler.createDefaultCategories();
      let restoredDefaultCategories: Category[] = [];
      if (categories.length === 0) {
        await storageHandler.saveCategories(defaultCategories);
      } else {
        const deletedDefaultCategories = await storageHandler.getCategories({
          isValid: false,
          isDefault: true,
        });
        deletedDefaultCategories.forEach(category => (category.isValid = true));
        await storageHandler.saveCategories(deletedDefaultCategories);
      }
      restoredDefaultCategories = await storageHandler.getCategories({
        isValid: true,
      });
      loadCategoriesToStore(restoredDefaultCategories);

      alert(I18n.t('message_successful_restore_default_categories'));
    } catch (error) {
      console.log('HANDLE RESTORE DEFAULT CATEGORIES ERROR: ', error);
    }
  };

  const handleWipeAllDataButton = async () => {
    try {
      const storageHandler = await StorageHandler.getInstance();
      await storageHandler.wipeAllData();
      clearAllData();
      alert(I18n.t('message_successful_data_wipe'));
    } catch (error) {
      console.log('WIPE DATA ERROR: ', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <List.Item
            title={I18n.t('label_category_management')}
            onPress={handleCategoryManagementPress}
          />
          <Divider />
          <List.Item
            title={I18n.t('label_subscription_management')}
            onPress={handleSubscriptionManagementPress}
          />
          <Divider />
          <List.Item
            titleStyle={{
              color: canRestoreDefaultCategories ? undefined : 'gray',
            }}
            disabled={!canRestoreDefaultCategories}
            title={I18n.t('label_restore_default_categories')}
            onPress={handleRestoreDefaultCategoriesPress}
          />
          <Divider />
          <List.Item
            titleStyle={{color: canWipeData ? undefined : 'gray'}}
            disabled={!canWipeData}
            title={I18n.t('label_wipe_all_data')}
            onPress={handleWipeAllDataButton}
          />
          <Divider />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const loadCategoriesToStore = (
  categories: Category[],
): ThunkAction<void, AppState, null, Action<string>> => dispatch => {
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
    categories: categories,
  });
};

const clearAllData = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => dispatch => {
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: new Map(),
  });
  dispatch({
    type: ACTION_TYPES.SUBSCRIPTIONS_LOADED,
    subscriptions: [],
  });
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
    categories: [],
  });
};

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
  subscriptions: state.subscriptionReducer.subscriptions,
  categories: state.categoryReducer.categories,
});

const mapDispatchToProps = {
  clearAllData,
  loadCategoriesToStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
