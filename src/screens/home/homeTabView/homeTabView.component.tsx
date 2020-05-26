import React, {memo} from 'react';
import {Dimensions} from 'react-native';
import {
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import {NavigationState} from 'react-native-tab-view/lib/typescript/src/types';
import HomeTabScene from './homeTabScene';
import Operation from '../../../entities/Operation';
import {GroupedBy, UnitOfDate} from '../home.component';

const initialLayout = {width: Dimensions.get('window').width};

type HomeTabViewProps = {
  routeOperationsMap: Map<number, Operation[]>;
  groupedBy: GroupedBy;
  unitOfDate: UnitOfDate;
  routes: Route[];
  index: number;

  changeIndex: (index: number) => void;
  onOperationPress: (operation: Operation) => void;
  onOperationLongPress: (
    operation: Operation,
    anchor: {x: number; y: number},
  ) => void;
};

const HomeTabView = (props: HomeTabViewProps) => {
  const {
    routeOperationsMap,
    index,
    routes,
    groupedBy,
    unitOfDate,
    changeIndex,
    onOperationPress,
    onOperationLongPress,
  } = props;

  const renderTabBar = (
    tabBarProps: SceneRendererProps & {
      navigationState: NavigationState<Route>;
    },
  ) => {
    return (
      <TabBar
        {...tabBarProps}
        indicatorStyle={{backgroundColor: 'white'}}
        tabStyle={{width: 'auto', minWidth: 120, height: 50}}
        scrollEnabled={true}
      />
    );
  };

  const renderScene = (tabViewProps: SceneRendererProps & {route: Route}) => {
    const tabIndex = parseInt(tabViewProps.route.key, 10);
    const operations = routeOperationsMap.get(tabIndex) || [];
    return (
      <HomeTabScene
        operations={operations}
        groupedBy={groupedBy}
        unitOfDate={unitOfDate}
        onOperationPress={onOperationPress}
        onOperationLongPress={onOperationLongPress}
      />
    );
  };

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={changeIndex}
      initialLayout={initialLayout}
      lazy={true}
      lazyPreloadDistance={1}
    />
  );
};

export default memo(HomeTabView);
