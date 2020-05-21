import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import I18n from '../../i18n/i18n';
import {Divider, List} from 'react-native-paper';
import StorageHandler from '../../storage/StorageHandler';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';

type SettingsScreenProps = {
  route: RouteProp<RootStackParamList, 'Tab'>;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
  clearAllData: () => void;
};

const SettingsScreen = (props: SettingsScreenProps) => {
  const {navigation, clearAllData} = props;

  const handleCategoryManagementPress = () => {
    navigation.navigate('Categories', {
      previousScreen: 'Settings',
    });
  };

  const handleSubscriptionManagementPress = () => {
    navigation.navigate('Subscriptions');
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
            title={I18n.t('label_restore_default_categories')}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title={I18n.t('label_wipe_all_data')}
            onPress={handleWipeAllDataButton}
          />
          <Divider />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const clearAllData = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => dispatch => {
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: [],
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

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  clearAllData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);