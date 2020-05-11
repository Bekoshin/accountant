import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import I18n from '../../i18n/i18n';
import {Divider, List} from 'react-native-paper';

type SettingsScreenProps = {
  route: RouteProp<RootStackParamList, 'Tab'>;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
};

const SettingsScreen = (props: SettingsScreenProps) => {
  const {navigation, route} = props;

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscriptions');
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <List.Item
            title={I18n.t('label_category_management')}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title={I18n.t('label_subscription_management')}
            onPress={handleSubscriptionPress}
          />
          <Divider />
          <List.Item
            title={I18n.t('label_return_default_categories')}
            onPress={() => {}}
          />
          <Divider />
          <List.Item title={I18n.t('label_wipe_all_data')} onPress={() => {}} />
          <Divider />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(SettingsScreen);
