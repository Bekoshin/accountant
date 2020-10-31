import React, {useEffect, useLayoutEffect, useState} from 'react';
import moment, {DurationInputArg2} from 'moment';
import {StackNavigationProp} from '@react-navigation/stack';
import {Alert, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Operation from '../../entities/Operation';
import {Menu} from 'react-native-paper';
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
import {Fab} from './fab/fab';
import {RootStackParamList} from '../../App';
import HomeTabView from './homeTabView/homeTabView';
import ScrollableTabView, {
  ChangeTabProperties,
} from 'react-native-scrollable-tab-view';
import {
  changeRoutesTitle,
  createRouteTitles,
} from '../../utils/HomeTabViewUtils';
import {RewindButton} from '../../components/rewindButton/RewindButton';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import {LineAwesomeIcon} from '../../constants/LineAwesomeIconSet';
import {COLORS} from '../../constants/colors';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
export const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];
export const DATE = 'date';
export const CATEGORY = 'category';
export type GroupedBy = 'date' | 'category';

export const TABS_COUNT = 12;

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;

  operations: Operation[];
  filter: Filter | null;

  deleteOperation: (operation: Operation) => void;
  applyFilter: (filter: Filter | null) => void;
};

const HomeScreen = (props: HomeScreenProps) => {
  const {operations, navigation, filter} = props;

  const [unitOfDateIndex, setUnitOfDateIndex] = useState(1);
  const routeTitles = createRouteTitles(UNITS_OF_DATE[unitOfDateIndex]);
  const [tabIndex, setTabIndex] = useState(TABS_COUNT - 1);
  const [routeOperationsMap, setRouteOperationsMap] = useState(
    new Map<number, Operation[]>(),
  );
  const [total, setTotal] = useState(0);
  const [operationMenuVisible, setOperationMenuVisible] = useState(false);
  const [groupedBy, setGroupedBy] = useState<GroupedBy>(DATE);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0});
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );
  const [tabViewRef, setTabViewRef] = useState<ScrollableTabView | null>(null);

  useLayoutEffect(() => {
    const handleGroupBy = async () => {
      const attribute = groupedBy === DATE ? CATEGORY : DATE;
      setGroupedBy(attribute);
    };
    const handleFiltersButton = () => {
      navigation.navigate('Filters', {});
    };

    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          title={
            I18n.t('label_total') + ': ' + formatNumberToDecimal(total) + ' ₽'
          }
          searchMode={searchMode}
          searchButton={true}
          showSearchBar={showSearchBar}
          hideSearchBar={hideSearchBar}
          searchQuery={searchQuery}
          changeSearchQuery={setSearchQuery}>
          <TouchableOpacity style={{marginLeft: 13}} onPress={handleGroupBy}>
            <LineAwesomeIcon
              name={
                groupedBy === DATE ? 'sort-alpha-down' : 'sort-numeric-down'
              }
              size={22}
              color={COLORS.SECONDARY_DARK_1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 13}}
            onPress={handleFiltersButton}>
            <LineAwesomeIcon
              name="filter"
              size={22}
              color={COLORS.SECONDARY_DARK_1}
            />
            {filter ? <View style={styles.filterIconBadge} /> : null}
          </TouchableOpacity>
        </Header>
      ),
    });
  }, [navigation, searchMode, total, filter, groupedBy, searchQuery]);

  useEffect(() => {
    setRouteOperationsMap(
      createRouteOperationsMap(operations, UNITS_OF_DATE[unitOfDateIndex]),
    );
    console.log('CREATE ROUT OPERATIONS MAP');
  }, [operations, unitOfDateIndex]);

  useEffect(() => {
    const filteredOperations = routeOperationsMap.get(tabIndex);
    if (!filteredOperations) {
      return;
    }

    const newTotal = calculateTotalAmount(filteredOperations);
    setTotal(newTotal);
    console.log('TAB INDEX EFFECT');
  }, [routeOperationsMap, tabIndex]);

  const handleUnitOfDateIndexChanged = (index: number) => {
    setUnitOfDateIndex(index);
    changeRoutesTitle(routeTitles, UNITS_OF_DATE[index]);
    goToLastTabPage();
  };

  const handleTabChange = (value: ChangeTabProperties) => {
    setTabIndex(value.i);
  };

  const showOperationMenu = () => {
    setOperationMenuVisible(true);
  };

  const hideOperationMenu = () => {
    setOperationMenuVisible(false);
  };

  const showSearchBar = () => {
    setSearchMode(true);
  };

  const hideSearchBar = () => {
    setSearchMode(false);
  };

  const goToLastTabPage = () => {
    if (tabViewRef) {
      // @ts-ignore
      tabViewRef.goToPage(TABS_COUNT - 1);
    }
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
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <SegmentedControlTab
          values={[
            I18n.t('label_week'),
            I18n.t('label_month'),
            I18n.t('label_year'),
          ]}
          selectedIndex={unitOfDateIndex}
          onTabPress={handleUnitOfDateIndexChanged}
        />
        {routeTitles.length > 0 ? (
          <View style={styles.mainContainer}>
            <HomeTabView
              routeOperationsMap={routeOperationsMap}
              titles={routeTitles}
              groupedBy={groupedBy}
              unitOfDate={UNITS_OF_DATE[unitOfDateIndex]}
              changeIndex={handleTabChange}
              onOperationPress={handleOperationPress}
              onOperationLongPress={handleOperationLongPress}
              setTabViewRef={setTabViewRef}
            />
            <RewindButton
              visible={tabIndex < TABS_COUNT - 1}
              onPress={goToLastTabPage}
            />
          </View>
        ) : null}
        <Fab
          addOperation={() => navigation.navigate('Operation', {})}
          addSubscription={() => navigation.navigate('Subscription', {})}
        />
        {renderOperationMenu()}
      </SafeAreaView>
    </View>
  );
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
  const currentDate = moment().subtract(TABS_COUNT, unit);
  for (let i = 0; i < TABS_COUNT; i++) {
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
