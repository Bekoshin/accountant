import React, {Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/min/locales';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import I18n from 'i18n-js';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';

import 'reflect-metadata';

import store from './store/store';

import Welcome from './screens/welcome/welсome';
import HomeScreen from './screens/home/home.component';
import Shopping from './screens/shopping/shopping';
import Analytics from './screens/analytics/analytics';
import Settings from './screens/settings/settings';
import OperationScreen from './screens/operation/operation.component';
import SubscriptionScreen from './screens/subscription/subscription.component';
import CategoriesSreen from './screens/categories/categories.component';
import CategoryScreen from './screens/category/category.component';
import ParentCategoriesScreen from './screens/parentCategories/parentCategories.component';
import FiltersScreen from './screens/filters/filters.component';

const BottomNavigator = createMaterialBottomTabNavigator(
  {
    HomeStackNavigator: {
      screen: createStackNavigator({
        Home: HomeScreen,
      }),
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'home'} />
          </View>
        ),
      },
    },
    Shopping: {
      screen: Shopping,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              style={[{color: tintColor}]}
              size={25}
              name={'shopping-cart'}
            />
          </View>
        ),
      },
    },
    Analytics: {
      screen: Analytics,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'pie-chart'} />
          </View>
        ),
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'cog'} />
          </View>
        ),
      },
    },
  },
  {
    initialRouteName: 'HomeStackNavigator',
  },
);

const AppStackNavigator = createStackNavigator(
  {
    BottomNavigator: {
      screen: BottomNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Operation: {
      screen: OperationScreen,
    },
    Subscription: {
      screen: SubscriptionScreen,
    },
    Categories: {
      screen: CategoriesSreen,
    },
    Category: {
      screen: CategoryScreen,
    },
    ParentCategories: {
      screen: ParentCategoriesScreen,
    },
    Filters: {
      screen: FiltersScreen,
    },
  },
  {
    initialRouteName: 'BottomNavigator',
  },
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Welcome: Welcome,
      App: AppStackNavigator,
    },
    {
      initialRouteName: 'Welcome',
    },
  ),
);

export default class App extends Component {
  componentDidMount(): void {
    moment.locale(I18n.t('locale'));
  }

  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <AppContainer />
        </PaperProvider>
      </Provider>
    );
  }
}
