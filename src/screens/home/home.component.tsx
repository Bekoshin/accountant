import React, {useEffect, useState} from 'react';
import moment, {DurationInputArg2} from 'moment';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Alert, View} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Operation from '../../entities/Operation';
import {Menu, Appbar, Searchbar} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import I18n from '../../i18n/i18n';
import {
  formatNumberToDecimal,
  deleteOperation,
  filterOperationsByDate,
  calculateTotalAmount,
} from '../../utils/OperationUtils';
import {Filter} from '../../entities/Filter';
import {applyFilter} from '../../utils/FilterUtils';
import {Fab} from './fab/fab.component';
import {RootStackParamList} from '../../App';
import {HomeMainAppBar} from '../../components/appBars/homeMainAppBar/homeMainAppBar.component';
import HomeTabView from './homeTabView/homeTabView.component';
import {Route} from 'react-native-tab-view';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
export const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];
export const DATE = 'date';
export const CATEGORY = 'category';
export type GroupedBy = 'date' | 'category';

type HomeScreenProps = {
  route: RouteProp<RootStackParamList, 'Tab'>;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;

  operations: Operation[];
  filter: Filter | null;

  deleteOperation: (operation: Operation) => void;
  applyFilter: (filter: Filter | null) => void;
};

const HomeScreen = (props: HomeScreenProps) => {
  const {operations, navigation, filter} = props;

  const [unitOfDateIndex, setUnitOfDateIndex] = useState(1);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [tabIndex, setTabIndex] = useState(11);
  const [routeOperationsMap, setRouteOperationsMap] = useState(
    new Map<number, Operation[]>(),
  );
  const [total, setTotal] = useState(0);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [operationMenuVisible, setOperationMenuVisible] = useState(false);
  const [groupedBy, setGroupedBy] = useState<GroupedBy>(DATE);
  const [searchMode, setSearchMode] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0});
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );

  useEffect(() => {
    setRouteOperationsMap(
      createRouteOperationsMap(operations, UNITS_OF_DATE[unitOfDateIndex]),
    );
    console.log('CREATE ROUT OPERATIONS MAP');
  }, [operations, unitOfDateIndex]);

  useEffect(() => {
    setRoutes(createRoutes(UNITS_OF_DATE[unitOfDateIndex]));
    console.log('CREATE ROUTES');
  }, [unitOfDateIndex]);

  useEffect(() => {
    const filteredOperations = routeOperationsMap.get(tabIndex);
    if (!filteredOperations) {
      return;
    }

    const newTotal = calculateTotalAmount(filteredOperations);
    setTotal(newTotal);
    console.log('TAB INDEX EFFECT');
  }, [routeOperationsMap, tabIndex]);

  const handleGroupBy = async () => {
    const attribute = groupedBy === DATE ? CATEGORY : DATE;
    setGroupedBy(attribute);
    setMoreMenuVisible(false);
  };

  const handleUnitOfDateIndexChanged = (index: number) => {
    setUnitOfDateIndex(index);
    setTabIndex(11);
  };

  const showMoreMenu = () => {
    setMoreMenuVisible(true);
  };

  const hideMoreMenu = () => {
    setMoreMenuVisible(false);
  };

  const showOperationMenu = () => {
    setOperationMenuVisible(true);
  };

  const hideOperationMenu = () => {
    setOperationMenuVisible(false);
  };

  const showSearchMode = () => {
    setSearchMode(true);
  };

  const hideSearchMode = () => {
    setSearchMode(false);
  };

  const handleDeleteButton = () => {
    hideOperationMenu();
    const message = I18n.t('message_delete_operation') + '?';
    Alert.alert(I18n.t('label_deleting'), message, [
      {
        text: I18n.t('action_cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          console.log('OPERATION FOR DELETE: ', selectedOperation);
          if (selectedOperation) {
            props.deleteOperation(selectedOperation);
          }
        },
      },
    ]);
  };

  const handleFiltersButton = () => {
    hideMoreMenu();
    navigation.navigate('Filters');
  };

  const handleDropFiltersButton = async () => {
    hideMoreMenu();
    await props.applyFilter(null);
  };

  const handleOperationPress = (operation: Operation) => {
    navigation.navigate('Operation', {
      operation: operation,
    });
  };

  const handleOperationLongPress = (
    operation: Operation,
    anchor: {x: number; y: number},
  ) => {
    setMenuAnchor(anchor);
    showOperationMenu();
    setSelectedOperation(operation);
  };

  const renderSearchAppBar = () => {
    return (
      <Appbar.Header>
        <View style={{flex: 0.1}}>
          <Appbar.Action icon="arrow-left" onPress={hideSearchMode} />
        </View>
        <View style={{flex: 0.8}}>
          <Searchbar
            placeholder="Search"
            onChangeText={query => {
              console.log(query);
            }}
            value="qwe"
          />
        </View>
        <View style={{flex: 0.1}}>
          <Appbar.Action icon="magnify" onPress={showSearchMode} />
        </View>
      </Appbar.Header>
    );
  };

  const renderOperationMenu = () => {
    return (
      <Menu
        onDismiss={hideOperationMenu}
        visible={operationMenuVisible}
        anchor={{x: menuAnchor.x, y: menuAnchor.y}}>
        <Menu.Item
          icon="pencil"
          title={I18n.t('action_edit')}
          onPress={() => {
            navigation.navigate('Operation', {
              operation: selectedOperation as Operation,
            });
            hideOperationMenu();
          }}
        />
        <Menu.Item
          icon="delete"
          title={I18n.t('action_delete')}
          onPress={handleDeleteButton}
        />
      </Menu>
    );
  };

  console.log('HOME COMPONENT RENDER');
  return (
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
      {searchMode ? (
        renderSearchAppBar()
      ) : (
        <HomeMainAppBar
          title={
            I18n.t('label_total') + ': ' + formatNumberToDecimal(total) + ' ₽'
          }
          groupedBy={groupedBy}
          hasFilter={!!filter}
          menuVisible={moreMenuVisible}
          onDropFiltersPress={handleDropFiltersButton}
          onFilterPress={handleFiltersButton}
          onGroupByPress={handleGroupBy}
          onMenuButtonPress={showMoreMenu}
          onMenuDismiss={hideMoreMenu}
          onSearchButtonPress={showSearchMode}
        />
      )}
      <SegmentedControlTab
        values={['Неделя', 'Месяц', 'Год']}
        selectedIndex={unitOfDateIndex}
        onTabPress={handleUnitOfDateIndexChanged}
      />
      {routes.length > 0 ? (
        <HomeTabView
          routeOperationsMap={routeOperationsMap}
          routes={routes}
          index={tabIndex}
          groupedBy={groupedBy}
          unitOfDate={UNITS_OF_DATE[unitOfDateIndex]}
          changeIndex={setTabIndex}
          onOperationPress={handleOperationPress}
          onOperationLongPress={handleOperationLongPress}
        />
      ) : null}
      <Fab
        addOperation={() => navigation.navigate('Operation')}
        addSubscription={() => navigation.navigate('Subscription')}
      />
      {renderOperationMenu()}
    </View>
  );
};

const createRoutes = (unitOfDate: UnitOfDate): Route[] => {
  const date = moment();
  let routes: Route[] = [];
  let currentTitle = '';
  let lastTitle = '';
  if (unitOfDate === 'isoWeek') {
    date.subtract(11, 'week');
    currentTitle = I18n.t('label_this_week');
    lastTitle = I18n.t('label_last_week');
  } else if (unitOfDate === 'month') {
    date.subtract(11, 'month');
    currentTitle = I18n.t('label_this_month');
    lastTitle = I18n.t('label_last_month');
  } else if (unitOfDate === 'year') {
    date.subtract(11, 'year');
    currentTitle = I18n.t('label_this_year');
    lastTitle = I18n.t('label_last_year');
  } else {
    return routes;
  }
  for (let i = 0; i < 12; i++) {
    let title = '';
    if (unitOfDate === 'isoWeek') {
      title =
        date.startOf('isoWeek').format('D MMM') +
        ' - ' +
        date.endOf('isoWeek').format('D MMM');
      date.add(1, 'week');
    } else if (unitOfDate === 'month') {
      title = date.format('MMMM') + ', ' + date.format('YY');
      date.add(1, 'month');
    } else if (unitOfDate === 'year') {
      title = date.format('YYYY');
      date.add(1, 'year');
    }
    if (i === 10) {
      title = lastTitle;
    }
    if (i === 11) {
      title = currentTitle;
    }
    routes.push({key: i.toString(), title: title});
  }
  return routes;
};

const createRouteOperationsMap = (
  operations: Operation[],
  unitOfDate: UnitOfDate,
) => {
  let unit: DurationInputArg2 = 'month';
  if (unitOfDate === 'isoWeek') {
    unit = 'week';
  } else if (unitOfDate === 'year') {
    unit = 'year';
  }
  const routeOperationsMap = new Map<number, Operation[]>();
  const currentDate = moment().subtract(12, unit);
  for (let i = 0; i < 12; i++) {
    currentDate.add(1, unit);
    const filteredOperations = filterOperationsByDate(
      operations,
      currentDate,
      unitOfDate,
    );
    routeOperationsMap.set(i, filteredOperations);
  }
  return routeOperationsMap;
};

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
  filter: state.homeReducer.filter,
});

const mapDispatchToProps = {
  deleteOperation: (operation: Operation) => deleteOperation(operation),
  applyFilter: (filter: Filter | null) => applyFilter(filter),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);
