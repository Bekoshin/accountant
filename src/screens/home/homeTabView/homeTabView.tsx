import React, {memo} from 'react';
import HomeTabScene from './homeTabScene';
import Operation from '../../../entities/Operation';
import {GroupedBy, UnitOfDate} from '../home';
import ScrollableTabView, {
  ChangeTabProperties,
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

type HomeTabViewProps = {
  routeOperationsMap: Map<number, Operation[]>;
  groupedBy: GroupedBy;
  unitOfDate: UnitOfDate;
  titles: string[];

  changeIndex: (index: ChangeTabProperties) => void;
  onOperationPress: (operation: Operation) => void;
  onOperationLongPress: (
    operation: Operation,
    anchor: {x: number; y: number},
  ) => void;
  setTabViewRef: (tabView: ScrollableTabView) => void;
};

const HomeTabView = (props: HomeTabViewProps) => {
  const {
    routeOperationsMap,
    titles,
    groupedBy,
    unitOfDate,
    changeIndex,
    onOperationPress,
    onOperationLongPress,
    setTabViewRef,
  } = props;

  const renderScenes = () => {
    const scenes: any[] = [];
    routeOperationsMap.forEach((operations, tabIndex) => {
      scenes.push(
        <HomeTabScene
          key={tabIndex}
          tabLabel={titles[tabIndex]}
          operations={operations}
          groupedBy={groupedBy}
          unitOfDate={unitOfDate}
          onOperationPress={onOperationPress}
          onOperationLongPress={onOperationLongPress}
        />,
      );
    });
    return scenes;
  };

  return (
    <ScrollableTabView
      ref={setTabViewRef}
      initialPage={11}
      renderTabBar={() => <ScrollableTabBar />}
      onChangeTab={changeIndex}>
      {renderScenes()}
    </ScrollableTabView>
  );
};

export default memo(HomeTabView);
