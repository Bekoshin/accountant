import React, {useState} from 'react';
import moment from 'moment';
import 'moment/min/locales';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import I18n from 'i18n-js';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';

import 'reflect-metadata';

import store from './store/store';

import WelcomeScreen from './screens/welcome/welсome';
import HomeScreen from './screens/home/home';
import Shopping from './screens/shopping/shopping';
import Analytics from './screens/analytics/analytics';
import SettingsScreen from './screens/settings/settings';
import OperationScreen from './screens/operation/operation';
import SubscriptionsScreen from './screens/subscriptions/subscriptions';
import SubscriptionScreen from './screens/subscription/subscription';
import CategoriesSreen from './screens/categories/categories';
import CategoryScreen from './screens/category/category';
import ParentCategoriesScreen from './screens/parentCategories/parentCategories';
import FiltersScreen from './screens/filters/filters';

import 'react-native-gesture-handler';
import Operation from './entities/Operation';
import Category from './entities/Category';
import Subscription from './entities/Subscription';
import {LineAwesomeIcon} from './constants/LineAwesomeIconSet';
import {COLORS} from './constants/colors';
import {TYPOGRAPHY} from './constants/typography';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.BACKGROUND_1,
    card: 'white',
  },
};

export type RootStackParamList = {
  Tab: undefined;
  Operation: {operation?: Operation; selectedCategory?: Category};
  Subscriptions: undefined;
  Subscription: {subscription?: Subscription; selectedCategory?: Category};
  Categories: {
    previousScreen: 'Subscription' | 'Operation' | 'Filters' | 'Settings';
    selectedCategories?: Category[];
  };
  Category: {
    category?: Category;
    parentCategory?: Category;
    selectedParentCategory?: Category;
  };
  ParentCategories: undefined;
  Filters: {selectedCategories?: Category[]};
};

const Stack = createStackNavigator<RootStackParamList>();
const RootStack = () => {
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    return <WelcomeScreen setInitialized={setInitialized} />;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: TYPOGRAPHY.HEADER_4,
        headerTitle: () => null,
        headerLeft: () => null,
        headerShown: false,
      }}
      initialRouteName="Tab">
      <Stack.Screen name="Tab" component={TabStack} />
      <Stack.Screen
        name="Operation"
        component={OperationScreen}
        options={{headerShown: true}}
        initialParams={{operation: undefined}}
      />
      <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{headerShown: true}}
        initialParams={{subscription: undefined}}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesSreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{headerShown: true}}
        initialParams={{
          category: undefined,
          parentCategory: undefined,
          selectedParentCategory: undefined,
        }}
      />
      <Stack.Screen
        name="ParentCategories"
        options={{headerShown: true}}
        component={ParentCategoriesScreen}
      />
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{headerShown: true}}
        initialParams={{selectedCategories: undefined}}
      />
    </Stack.Navigator>
  );
};

export type TabStackParamList = {
  Home: undefined;
  Shopping: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator();
const TabStack = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      keyboardHidesTabBar: true,
      labelStyle: {fontFamily: 'Rubik-Medium'},
    }}>
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarIcon: ({color}) => (
          <LineAwesomeIcon name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Shopping"
      component={Shopping}
      options={{
        tabBarIcon: ({color}) => (
          <LineAwesomeIcon name="cart" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Analytics"
      component={Analytics}
      options={{
        tabBarIcon: ({color}) => (
          <LineAwesomeIcon name="chart-pie" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({color}) => (
          <LineAwesomeIcon name="cog" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export type HomeParamList = {
  Home: undefined;
};

const NavigationHome = createStackNavigator<HomeParamList>();
export const HomeStack = () => (
  <NavigationHome.Navigator
    screenOptions={{
      headerTitleStyle: TYPOGRAPHY.HEADER_4,
      headerTitle: () => null,
      headerLeft: () => null,
    }}>
    <NavigationHome.Screen name="Home" component={HomeScreen} />
  </NavigationHome.Navigator>
);

const App = () => {
  moment.locale(I18n.t('locale'));

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer theme={Theme}>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
