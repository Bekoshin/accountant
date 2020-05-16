import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import {SubscriptionsAppBar} from '../../components/appBars/subscriptionsAppBar/subscriptionsAppBar.component';
import I18n from '../../i18n/i18n';
import Subscription from '../../entities/Subscription';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import {Menu, List, Appbar, Searchbar} from 'react-native-paper';

const DAY = 'day';
const CATEGORY = 'category';
type GroupedBy = 'day' | 'category';

type SubscriptionsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Subscriptions'>;
  route: RouteProp<RootStackParamList, 'Subscriptions'>;

  subscriptions: Subscription[];
};

const SubscriptionsScreen = (props: SubscriptionsScreenProps) => {
  const {navigation, route, subscriptions} = props;

  const [subscriptionMap, setSubscriptionMap] = useState(
    new Map<string, Subscription[]>(),
  );
  const [groupedBy, setGroupedBy] = useState<GroupedBy>(DAY);

  useEffect(() => {
    const newSubscriptionMap = new Map<string, Subscription[]>();
    if (groupedBy === CATEGORY) {
      for (let subscription of subscriptions) {

      }
    }
  }, [groupedBy, subscriptions]);

  const renderSubscriptionSections = () => {
    let subscriptionComponents: any[] = [];
    subscriptionMap.forEach(
      (tempSubscriptions: Subscription[], key: string) => {
        subscriptionComponents.push(
          <List.Section>
            <List.Subheader>{key}</List.Subheader>
          </List.Section>,
        );
      },
    );

    if (subscriptionComponents.length > 0) {
      return (
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {subscriptionComponents}
        </ScrollView>
      );
    } else {
      return <Text>Вы еще не добавили ни одну подписку</Text>;
    }
  };

  return (
    <View style={{flex: 1}}>
      <SubscriptionsAppBar
        title={I18n.t('subscriptions_screen')}
        onBackButtonPress={navigation.goBack}
      />
      <SafeAreaView style={{flex: 1}}>
        {renderSubscriptionSections()}
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  subscriptions: state.subscriptionReducer.subscriptions,
});

export default connect(mapStateToProps)(SubscriptionsScreen);
