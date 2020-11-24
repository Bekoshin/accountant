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
import {Alert} from 'react-native';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';

export type GroupedBy = 'day' | 'category';

type SubscriptionsControllerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Subscriptions'>;
  subscriptions: Subscription[];

  deleteSubscription: (subscription: Subscription) => Promise<void>;
};

const SubscriptionController = (props: SubscriptionsControllerProps) => {
  const {navigation, subscriptions, deleteSubscription} = props;

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
    const message = createMessageForDeleteSubscription(subscription);
    Alert.alert(I18n.t('label_deleting'), message, [
      {
        text: I18n.t('action_cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await deleteSubscription(subscription);
        },
      },
    ]);
  };

  const createMessageForDeleteSubscription = (
    subscription: Subscription,
  ): string => {
    let message: string;
    message =
      I18n.t('message_delete_subscription') +
      ' "' +
      I18n.t(subscription.name, {
        defaultValue: subscription.name,
      }) +
      '" ?';
    return message;
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

const deleteSubscription = (
  subscription: Subscription,
): ThunkAction<Promise<void>, AppState, null, Action<string>> => async (
  dispatch,
) => {
  const storageHandler = await StorageHandler.getInstance();
  await storageHandler.deleteSubscription(subscription);
  const updatedSubscriptions = await storageHandler.getAllSubscriptions();
  dispatch({
    type: ACTION_TYPES.SUBSCRIPTIONS_LOADED,
    subscriptions: updatedSubscriptions,
  });
};

const mapStateToProps = (state: AppState) => ({
  subscriptions: state.subscriptionReducer.subscriptions,
});

const mapDispatchToProps = {
  deleteSubscription: (subscription: Subscription) =>
    deleteSubscription(subscription),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscriptionController);
