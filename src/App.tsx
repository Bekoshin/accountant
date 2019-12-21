import React, {Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/min/locales';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import I18n from 'i18n-js';

import {Provider} from 'react-redux';

import 'reflect-metadata';

import store from './store/store';

import Welcome from './components/screens/welcome/welсome';
import Home from './components/screens/home/home';
import Shopping from './components/screens/shopping/shopping';
import Analytics from './components/screens/analytics/analytics';
import Settings from './components/screens/settings/settings';
import OperationScreen from './components/screens/operation/operation';
import CategoriesSreen from './components/screens/categories/categories.component';
import CategoryScreen from './components/screens/category/category.component';

const BottomNavigator = createMaterialBottomTabNavigator(
  {
    HomeStackNavigator: {
      screen: Home,
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
    Categories: {
      screen: CategoriesSreen,
    },
    Category: {
      screen: CategoryScreen,
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
        <AppContainer />
      </Provider>
    );
  }
}
