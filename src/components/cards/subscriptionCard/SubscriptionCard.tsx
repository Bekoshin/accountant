import React from 'react';
import Subscription from '../../../entities/Subscription';
import {SwipeableCard} from '../swipeableCard/SwipeableCard';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatNumberToDecimal} from '../../../utils/OperationUtils';
import I18n from '../../../i18n/i18n';

type SubscriptionCardProps = {
  subscription: Subscription;
  onPress: (subscription: Subscription) => void;
  onDeletePress: (subscription: Subscription) => Promise<void>;
  style?: StyleProp<ViewStyle>;
};

export const SubscriptionCard = (props: SubscriptionCardProps) => {
  const {subscription, onPress, onDeletePress, style} = props;

  const handlePress = () => {
    onPress(subscription);
  };

  const handleDeletePress = async () => {
    await onDeletePress(subscription);
  };

  return (
    <SwipeableCard
      style={style}
      onRightButtonPress={handleDeletePress}
      onPress={handlePress}>
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
        <Text style={styles.categoryName}>
          {I18n.t(subscription.category.name, {
            defaultValue: subscription.category.name,
          })}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.categoryName}>
          {formatNumberToDecimal(subscription.amount)} ₽
        </Text>
      </View>
    </SwipeableCard>
  );
};
