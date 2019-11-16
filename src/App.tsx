import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import {Provider} from 'react-redux';

import store from './store/store';

import Welcome from './components/screens/welcome/welсome';
import Home from './components/screens/home/home';
import Shopping from './components/screens/shopping/shopping';
import Analytics from './components/screens/analytics/analytics';

const BottomNavigator = createMaterialBottomTabNavigator(
  {
    Home: Home,
    Shopping: Shopping,
    Analytics: Analytics,
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Welcome: Welcome,
      App: BottomNavigator,
    },
    {
      initialRouteName: 'Welcome',
    },
  ),
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
