import React, {useState} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/min/locales';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import I18n from 'i18n-js';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';

import 'reflect-metadata';

import store from './store/store';

import WelcomeScreen from './screens/welcome/welсome.component';
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

import 'react-native-gesture-handler';
import Operation from './entities/Operation';

export type RootStackParamList = {
  Tab: undefined;
  Operation: {operation: Operation | undefined};
  Subscription: undefined;
  Categories: undefined;
  Category: undefined;
  ParentCategories: undefined;
  Filters: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = () => {
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    return <WelcomeScreen setInitialized={setInitialized} />;
  }
  return (
    <Stack.Navigator
      screenOptions={{gestureEnabled: true}}
      headerMode="none"
      initialRouteName="Tab">
      <Stack.Screen name="Tab" component={TabStack} />
      <Stack.Screen name="Operation" component={OperationScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Categories" component={CategoriesSreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen
        name="ParentCategories"
        component={ParentCategoriesScreen}
      />
      <Stack.Screen name="Filters" component={FiltersScreen} />
    </Stack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();
const TabStack = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({color}) => (
          <View>
            <Icon style={[{color: color}]} size={25} name={'home'} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Shopping"
      component={Shopping}
      options={{
        tabBarIcon: ({color}) => (
          <View>
            <Icon style={[{color: color}]} size={25} name={'shopping-cart'} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Analytics"
      component={Analytics}
      options={{
        tabBarIcon: ({color}) => (
          <View>
            <Icon style={[{color: color}]} size={25} name={'pie-chart'} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({color}) => (
          <View>
            <Icon style={[{color: color}]} size={25} name={'cog'} />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  moment.locale(I18n.t('locale'));

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
