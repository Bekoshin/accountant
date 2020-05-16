import React, {useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import {SubscriptionsAppBar} from '../../components/appBars/subscriptionsAppBar/subscriptionsAppBar.component';
import I18n from '../../i18n/i18n';
import Subscription from '../../entities/Subscription';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import {Menu, List, Appbar, Searchbar} from 'react-native-paper';
import {
  formatNumberToDecimal,
  groupByCategory,
} from '../../utils/OperationUtils';
import {groupByDay} from '../../utils/SubscriptionUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  const renderSubscriptionSections = () => {
    let subscriptionComponents: any[] = [];
    subscriptionMap.forEach((tempSubscriptions: Subscription[]) => {
      if (tempSubscriptions.length > 0) {
        let key;
        let subheader;
        if (groupedBy === DAY) {
          key = tempSubscriptions[0].day;
          subheader =
            tempSubscriptions[0].day.toString() +
            ' ' +
            I18n.t('label_day_of_month');
        } else {
          key = tempSubscriptions[0].category.id;
          subheader = I18n.t(tempSubscriptions[0].category.name, {
            defaultValue: tempSubscriptions[0].category.name,
          });
        }
        subscriptionComponents.push(
          <List.Section key={key}>
            <List.Subheader>{subheader}</List.Subheader>
            {renderSubscriptions(tempSubscriptions)}
          </List.Section>,
        );
      }
    });

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

  const renderSubscriptions = (groupedSubscriptions: Subscription[]) => {
    let subscriptionComponents = [];
    for (let subscription of groupedSubscriptions) {
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
        <List.Item
          key={subscription.id}
          title={title}
          onPress={() =>
            navigation.navigate('Subscription', {
              subscription: subscription,
            })
          }
          // onLongPress={
          //   ((evt: GestureResponderEvent) => {
          //     const x = evt.nativeEvent.pageX;
          //     const y = evt.nativeEvent.pageY;
          //     setMenuAnchor({x: x, y: y});
          //     showOperationMenu();
          //     setSelectedOperation(operation);
          //   }) as () => void
          // }
          left={
            subscription.category.iconName
              ? () => (
                  <Icon
                    name={subscription.category.iconName as string}
                    size={48}
                    color="black"
                  />
                )
              : undefined
          }
          right={() => (
            <View style={{justifyContent: 'center'}}>
              <Text>{formatNumberToDecimal(subscription.amount)} ₽</Text>
            </View>
          )}
        />,
      );
    }
    return subscriptionComponents;
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
