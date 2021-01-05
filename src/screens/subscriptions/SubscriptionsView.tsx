import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {styles} from './styles';
import Subscription from '../../entities/Subscription';
import I18n from '../../i18n/i18n';
import {SubscriptionCard} from '../../components/cards/subscriptionCard/SubscriptionCard';

type SubscriptionsViewProps = {
  subscriptionMap: Map<string, Subscription[]>;
  onSubscriptionPress: (subscription: Subscription) => void;
  deleteSubscription: (subscription: Subscription) => Promise<void>;
};

export const SubscriptionsView = (props: SubscriptionsViewProps) => {
  const {subscriptionMap, onSubscriptionPress, deleteSubscription} = props;

  const renderSection = ({item}: {item: [string, Subscription[]]}) => {
    const subscriptions = item[1];
    if (subscriptions.length > 0) {
      let key;
      let subheader;
      key = subscriptions[0].day;
      subheader =
        subscriptions[0].day.toString() + ' ' + I18n.t('label_day_of_month');

      return (
        <View style={styles.sectionContainer} key={key}>
          <Text style={styles.label}>{subheader}</Text>
          {renderSubscriptions(subscriptions)}
        </View>
      );
    } else {
      return null;
    }
  };

  const renderSubscriptions = (groupedSubscriptions: Subscription[]) => {
    let subscriptionComponents = [];
    for (let subscription of groupedSubscriptions) {
      const handlePress = () => {
        onSubscriptionPress(subscription);
      };
      subscriptionComponents.push(
        <SubscriptionCard
          key={subscription.id}
          style={styles.subscriptionCard}
          subscription={subscription}
          onDeletePress={deleteSubscription}
          onPress={handlePress}
        />,
      );
    }
    return subscriptionComponents;
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <FlatList
          contentContainerStyle={styles.flatListContentContainer}
          data={Array.from(subscriptionMap)}
          renderItem={renderSection}
          keyExtractor={(item) => item[0]}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </View>
  );
};
