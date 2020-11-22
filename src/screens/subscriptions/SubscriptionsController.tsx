import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import Subscription from '../../entities/Subscription';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import I18n from '../../i18n/i18n';
import {groupByCategory} from '../../utils/OperationUtils';
import {groupByDay} from '../../utils/SubscriptionUtils';
import {SubscriptionsView} from './SubscriptionsView';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {DAY, CATEGORY} from '../../constants/strings';

export type GroupedBy = 'day' | 'category';

type SubscriptionsControllerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Subscriptions'>;
  subscriptions: Subscription[];
};

const SubscriptionController = (props: SubscriptionsControllerProps) => {
  const {navigation, subscriptions} = props;

  const [subscriptionMap, setSubscriptionMap] = useState(
    new Map<string, Subscription[]>(),
  );
  const [groupedBy, setGroupedBy] = useState<GroupedBy>(DAY);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t('subscriptions_screen')}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    let newSubscriptionMap = new Map<string, Subscription[]>();
    if (groupedBy === CATEGORY) {
      newSubscriptionMap = groupByCategory(subscriptions) as Map<
        string,
        Subscription[]
      >;
    } else {
      newSubscriptionMap = groupByDay(subscriptions);
    }
    setSubscriptionMap(newSubscriptionMap);
  }, [groupedBy, subscriptions]);

  const handleSubscriptionPress = (subscription: Subscription) => {
    navigation.navigate('Subscription', {
      subscription: subscription,
    });
  };

  const handleDeleteSubscriptionPress = async (subscription: Subscription) => {

  };

  return (
    <SubscriptionsView
      subscriptionMap={subscriptionMap}
      groupedBy={groupedBy}
      onSubscriptionPress={handleSubscriptionPress}
      deleteSubscription={handleDeleteSubscriptionPress}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  subscriptions: state.subscriptionReducer.subscriptions,
});

export default connect(mapStateToProps)(SubscriptionController);
