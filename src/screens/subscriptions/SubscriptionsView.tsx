import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {styles} from './styles';
import Subscription from '../../entities/Subscription';
import {GroupedBy} from './SubscriptionsController';
import I18n from '../../i18n/i18n';
import {DAY} from '../../constants/strings';
import {SubscriptionCard} from '../../components/cards/subscriptionCard/SubscriptionCard';

type SubscriptionsViewProps = {
  subscriptionMap: Map<string, Subscription[]>;
  groupedBy: GroupedBy;
  onSubscriptionPress: (subscription: Subscription) => void;
  deleteSubscription: (subscription: Subscription) => Promise<void>;
};

export const SubscriptionsView = (props: SubscriptionsViewProps) => {
  const {subscriptionMap, groupedBy, onSubscriptionPress} = props;

  const renderSection = ({item}: {item: [string, Subscription[]]}) => {
    const subscriptions = item[1];
    if (subscriptions.length > 0) {
      let key;
      let subheader;
      if (groupedBy === DAY) {
        key = subscriptions[0].day;
        subheader =
          subscriptions[0].day.toString() + ' ' + I18n.t('label_day_of_month');
      } else {
        key = subscriptions[0].category.id;
        subheader = I18n.t(subscriptions[0].category.name, {
          defaultValue: subscriptions[0].category.name,
        });
      }

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
          style={styles.subscriptionCard}
          subscription={subscription}
          onDeletePress={async () => {}}
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
