import React from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {styles} from './styles';
import Subscription from '../../entities/Subscription';
import {GroupedBy} from './SubscriptionsController';
import I18n from '../../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatNumberToDecimal} from '../../utils/OperationUtils';
import {DAY} from '../../constants/strings';
import {COLORS} from '../../constants/colors';

type SubscriptionsViewProps = {
  subscriptionMap: Map<string, Subscription[]>;
  groupedBy: GroupedBy;
  onSubscriptionPress: (subscription: Subscription) => void;
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
      let title;
      if (groupedBy === DAY) {
        title = I18n.t(subscription.category.name, {
          defaultValue: subscription.category.name,
        });
      } else {
        title =
          subscription.day.toString() + ' ' + I18n.t('label_day_of_month');
      }
      subscriptionComponents.push(
        <TouchableHighlight
          style={styles.touchableContainer}
          onPress={handlePress}
          activeOpacity={0.9}
          underlayColor={COLORS.PRIMARY_DARK}>
          <View style={styles.subscriptionContainer} key={subscription.id}>
            <View style={styles.iconContainer}>
              {subscription.category.iconName ? (
                <Icon
                  name={subscription.category.iconName as string}
                  size={48}
                  color="black"
                />
              ) : null}
            </View>
            <View style={styles.categoryNameContainer}>
              <Text style={styles.categoryName}>{title}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.categoryName}>
                {formatNumberToDecimal(subscription.amount)} ₽
              </Text>
            </View>
          </View>
        </TouchableHighlight>,
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
