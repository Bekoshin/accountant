import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Alert,
  GestureResponderEvent,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Operation from '../../entities/Operation';
import {NoExpensesComponent} from '../../components/noExpenses/noExpenses.Component';
import {Menu, List, Appbar, Searchbar} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {DateSelector} from '../../components/dateSelector/dateSelector.component';
import I18n from '../../i18n/i18n';
import {convertDate, getMonthName} from '../../utils/DateUtils';
import {
  groupByDate,
  calculateTotalAmount,
  filterOperationsByDate,
  groupByCategory,
  groupByMonth,
  formatNumberToDecimal,
  deleteOperation,
} from '../../utils/OperationUtils';
import {Filter} from '../../entities/Filter';
import {applyFilter} from '../../utils/FilterUtils';
import {Fab} from './fab/fab.component';
import {RootStackParamList} from '../../App';
import {HomeMainAppBar} from '../../components/appBars/homeMainAppBar/homeMainAppBar.component';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];
export const DATE = 'date';
export const CATEGORY = 'category';
export type GropedBy = 'date' | 'category';

type HomeProps = {
  route: RouteProp<RootStackParamList, 'Tab'>;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;

  operations: Operation[];
  filter: Filter | null;

  deleteOperation: (operation: Operation) => void;
  applyFilter: (filter: Filter | null) => void;
};

const HomeScreen = (props: HomeProps) => {
  const {operations, navigation, filter} = props;

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [operationsMap, setOperationsMap] = useState(
    new Map<string, Operation[]>(),
  );
  const [total, setTotal] = useState(0);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [operationMenuVisible, setOperationMenuVisible] = useState(false);
  const [groupedBy, setGroupedBy] = useState<GropedBy>(DATE);
  const [searchMode, setSearchMode] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0});
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );

  const updateVisibleOperations = useCallback(
    (date: moment.Moment, index: number, attribute?: GropedBy) => {
      console.log('UPDATE VISIBLE OPERATIONS');
      const unitOfDate = UNITS_OF_DATE[index];
      const filteredOperations = filterOperationsByDate(
        operations,
        date,
        unitOfDate,
      );
      if (!attribute) {
        attribute = groupedBy;
      }
      let newOperationsMap;
      if (attribute === DATE) {
        if (unitOfDate === 'year') {
          newOperationsMap = groupByMonth(filteredOperations);
        } else {
          newOperationsMap = groupByDate(filteredOperations);
        }
      } else {
        newOperationsMap = groupByCategory(filteredOperations);
      }
      setOperationsMap(newOperationsMap);
      setTotal(calculateTotalAmount(filteredOperations));
      setMoreMenuVisible(false);
      setGroupedBy(attribute);
    },
    [groupedBy, operations],
  );

  useEffect(() => {
    updateVisibleOperations(selectedDate, selectedIndex);
  }, [selectedDate, selectedIndex, updateVisibleOperations]);

  const handleGroupBy = async () => {
    const attribute = groupedBy === DATE ? CATEGORY : DATE;
    await updateVisibleOperations(selectedDate, selectedIndex, attribute);
  };

  const handleIndexChanged = (index: number) => {
    const currentDate = moment();
    setSelectedIndex(index);
    setSelectedDate(currentDate);
  };

  const handleDateChanged = (date: moment.Moment) => {
    setSelectedDate(date);
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

  const showSearchMode = () => {
    setSearchMode(true);
  };

  const hideSearchMode = () => {
    setSearchMode(false);
  };

  const renderOperationSections = () => {
    let operationComponents: any = [];
    operationsMap.forEach((tempOperations: Operation[]) => {
      if (tempOperations.length > 0) {
        let key;
        let subheader;
        if (groupedBy === 'date') {
          if (UNITS_OF_DATE[selectedIndex] === 'year') {
            key = tempOperations[0].date.toString();
            subheader = getMonthName(tempOperations[0].date);
          } else {
            key = tempOperations[0].date.toString();
            subheader = convertDate(tempOperations[0].date);
          }
        } else {
          key = tempOperations[0].category.id;
          subheader = I18n.t(tempOperations[0].category.name, {
            defaultValue: tempOperations[0].category.name,
          });
        }
        operationComponents.push(
          <List.Section key={key}>
            <List.Subheader>{subheader}</List.Subheader>
            {renderOperations(tempOperations)}
          </List.Section>,
        );
      }
    });

    if (operationComponents.length > 0) {
      return (
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {operationComponents}
        </ScrollView>
      );
    } else {
      return <NoExpensesComponent />;
    }
  };

  const renderOperations = (groupedOperations: Operation[]) => {
    let operationComponents = [];
    for (let operation of groupedOperations) {
      let title;
      if (groupedBy === 'date') {
        title = I18n.t(operation.category.name, {
          defaultValue: operation.category.name,
        });
      } else {
        title = convertDate(operation.date);
      }
      operationComponents.push(
        <List.Item
          key={operation.id}
          title={title}
          onPress={() =>
            navigation.navigate('Operation', {
              operation: operation,
            })
          }
          onLongPress={
            ((evt: GestureResponderEvent) => {
              const x = evt.nativeEvent.pageX;
              const y = evt.nativeEvent.pageY;
              setMenuAnchor({x: x, y: y});
              showOperationMenu();
              setSelectedOperation(operation);
            }) as () => void
          }
          left={
            operation.category.image
              ? () => (
                  <Image
                    source={operation.category.image as number}
                    style={{width: 40, height: 40}}
                  />
                )
              : undefined
          }
          right={() => (
            <View style={{justifyContent: 'center'}}>
              <Text>{formatNumberToDecimal(operation.amount)} ₽</Text>
            </View>
          )}
        />,
      );
    }
    return operationComponents;
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
        selectedIndex={selectedIndex}
        onTabPress={handleIndexChanged}
      />
      <DateSelector
        type={UNITS_OF_DATE[selectedIndex]}
        date={selectedDate}
        changeDate={handleDateChanged}
      />
      {renderOperationSections()}
      <Fab
        addOperation={() => navigation.navigate('Operation')}
        addSubscription={() => navigation.navigate('Subscription')}
      />
      {renderOperationMenu()}
    </View>
  );
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
