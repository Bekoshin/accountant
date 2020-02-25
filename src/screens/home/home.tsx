import React from 'react';
import moment from 'moment';
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
import NoExpensesComponent from '../../components/noExpenses/noExpenses.Component';
import {FAB, Menu, List, Appbar, Searchbar} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DateSelector from '../../components/dateSelector/dateSelector.Component';
import I18n from '../../i18n/i18n';
import DateHandler from '../../utils/DateHandler';
import {groupByDate, calculateTotalAmount, filterOperationsByDate, groupByCategory, groupByMonth} from '../../utils/OperationUtils';
import styles from './home.styles';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];

interface HomeProps {
  navigation: any;

  operations: Operation[];

  deleteOperation: (operation: Operation) => void;
}

interface HomeState {
  selectedIndex: number;
  selectedDate: moment.Moment;
  operationsMap: Map<string, Operation[]>;
  total: number;
  isMoreMenuVisible: boolean;
  isOperationMenuVisible: boolean;
  groupedBy: 'date' | 'category';
  searchMode: boolean;
  menuAnchorX: number;
  menuAnchorY: number;
  selectedOperation: Operation | null;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    const selectedDate = moment();
    const selectedIndex = 1;
    const filteredOperations = filterOperationsByDate(
      this.props.operations,
      selectedDate,
      UNITS_OF_DATE[selectedIndex],
    );
    const operationsMap = groupByDate(filteredOperations);
    this.state = {
      selectedIndex: 1,
      selectedDate: selectedDate,
      operationsMap: operationsMap,
      total: calculateTotalAmount(filteredOperations),
      isMoreMenuVisible: false,
      isOperationMenuVisible: false,
      groupedBy: 'date',
      searchMode: false,
      menuAnchorX: 0,
      menuAnchorY: 0,
      selectedOperation: null,
    };
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  handleGroupBy = async (attribute: 'date' | 'category') => {
    const {selectedDate, selectedIndex} = this.state;
    await this.updateVisibleOperations(selectedDate, selectedIndex, attribute);
  };

  componentDidMount(): void {
    console.log('HOME DID MOUNT');
  }

  componentDidUpdate(prevProps: HomeProps) {
    console.log('COMPONENT DID UPDATE');
    if (this.props.operations !== prevProps.operations) {
      console.log('THIS PROPS  OPERATIONS: ', this.props.operations);
      console.log('PREV PROPS  OPERATIONS: ', prevProps.operations);
      this.updateVisibleOperations(
        this.state.selectedDate,
        this.state.selectedIndex,
      );
    }
  }

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  handleIndexChanged = (index: number) => {
    const currentDate = moment();
    this.setState({selectedIndex: index, selectedDate: currentDate});
    this.updateVisibleOperations(currentDate, index);
  };

  handleDateChanged = (date: moment.Moment) => {
    this.setState({selectedDate: date});
    this.updateVisibleOperations(date, this.state.selectedIndex);
  };

  updateVisibleOperations = (
    selectedDate: moment.Moment,
    selectedIndex: number,
    attribute?: 'date' | 'category',
  ) => {
    const unitOfDate = UNITS_OF_DATE[selectedIndex];
    const filteredOperations = filterOperationsByDate(
      this.props.operations,
      selectedDate,
      unitOfDate,
    );
    if (!attribute) {
      attribute = this.state.groupedBy;
    }
    let operationsMap;
    if (attribute === 'date') {
      if (unitOfDate === 'year') {
        operationsMap = groupByMonth(filteredOperations);
      } else {
        operationsMap = groupByDate(filteredOperations);
      }
    } else {
      operationsMap = groupByCategory(filteredOperations);
    }
    this.setState({
      operationsMap: operationsMap,
      total: calculateTotalAmount(filteredOperations),
      isMoreMenuVisible: false,
      groupedBy: attribute,
    });
  };

  render() {
    console.log('HOME RENDER');
    const {selectedIndex, searchMode} = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        {searchMode ? this.renderSearchAppBar() : this.renderMainAppBar()}
        <SegmentedControlTab
          values={['Неделя', 'Месяц', 'Год']}
          selectedIndex={selectedIndex}
          onTabPress={this.handleIndexChanged}
        />
        <DateSelector
          type={UNITS_OF_DATE[selectedIndex]}
          date={this.state.selectedDate}
          changeDate={this.handleDateChanged}
        />
        {this.renderOperationSections()}
        {this.renderFAB()}
        {this.renderOperationMenu()}
      </View>
    );
  }

  renderMainAppBar() {
    const {total, isMoreMenuVisible, groupedBy} = this.state;
    const {navigation} = this.props;
    return (
      <Appbar.Header>
        <Appbar.Content title={I18n.t('label_total') + ': ' + total + ' ₽'} />
        <Appbar.Action
          icon="magnify"
          onPress={() => this.setState({searchMode: true})}
        />
        <Menu
          onDismiss={() => {
            this.setState({isMoreMenuVisible: false});
          }}
          visible={isMoreMenuVisible}
          anchor={
            <Appbar.Action
              color="white"
              icon="dots-vertical"
              onPress={() => this.setState({isMoreMenuVisible: true})}
            />
          }>
          <Menu.Item
            title={
              groupedBy === 'date'
                ? I18n.t('action_group_by_category')
                : I18n.t('action_group_by_date')
            }
            onPress={() =>
              this.handleGroupBy(groupedBy === 'date' ? 'category' : 'date')
            }
          />
          <Menu.Item
            title={I18n.t('action_set_filters')}
            onPress={() => {
              this.setState({isMoreMenuVisible: false});
              navigation.navigate('Filters');
            }}
          />
        </Menu>
      </Appbar.Header>
    );
  }

  renderSearchAppBar() {
    return (
      <Appbar.Header>
        <View style={{flex: 0.1}}>
          <Appbar.Action
            icon="arrow-left"
            onPress={() => this.setState({searchMode: false})}
          />
        </View>
        <View style={{flex: 0.8}}>
          <Searchbar
            placeholder="Search"
            onChangeText={query => {}}
            value="qwe"
          />
        </View>
        <View style={{flex: 0.1}}>
          <Appbar.Action
            icon="magnify"
            onPress={() => this.setState({searchMode: true})}
          />
        </View>
      </Appbar.Header>
    );
  }

  renderOperationSections() {
    const {operationsMap, groupedBy, selectedIndex} = this.state;
    let operationComponents: any = [];
    operationsMap.forEach((operations: Operation[]) => {
      if (operations.length > 0) {
        let key;
        let subheader;
        if (groupedBy === 'date') {
          if (UNITS_OF_DATE[selectedIndex] === 'year') {
            key = operations[0].date.toString();
            subheader = DateHandler.getMonthName(operations[0].date);
          } else {
            key = operations[0].date.toString();
            subheader = DateHandler.convertDate(operations[0].date);
          }
        } else {
          key = operations[0].category.id;
          subheader = I18n.t(operations[0].category.name, {
            defaultValue: operations[0].category.name,
          });
        }
        operationComponents.push(
          <List.Section key={key}>
            <List.Subheader>{subheader}</List.Subheader>
            {this.renderOperations(operations)}
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
  }

  renderOperations(operations: Operation[]) {
    const {groupedBy} = this.state;
    const {navigation} = this.props;
    let operationComponents = [];
    for (let operation of operations) {
      let title;
      if (groupedBy === 'date') {
        title = I18n.t(operation.category.name, {
          defaultValue: operation.category.name,
        });
      } else {
        title = DateHandler.convertDate(operations[0].date);
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
          onLongPress={(evt: GestureResponderEvent) => {
            const x = evt.nativeEvent.pageX;
            const y = evt.nativeEvent.pageY;
            this.setState({
              menuAnchorX: x,
              menuAnchorY: y,
              isOperationMenuVisible: true,
              selectedOperation: operation,
            });
          }}
          left={
            operation.category.image
              ? () => (
                  <Image
                    source={operation.category.image}
                    style={{width: 40, height: 40}}
                  />
                )
              : undefined
          }
          right={() => <Text>{operation.amount} ₽</Text>}
        />,
      );
    }
    return operationComponents;
  }

  renderFAB() {
    return (
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => this.props.navigation.navigate('Operation')}
      />
    );
  }

  renderOperationMenu() {
    const {
      menuAnchorX,
      menuAnchorY,
      isOperationMenuVisible,
      selectedOperation,
    } = this.state;
    const {navigation} = this.props;
    return (
      <Menu
        onDismiss={() => {
          this.setState({isOperationMenuVisible: false});
        }}
        visible={isOperationMenuVisible}
        anchor={{x: menuAnchorX, y: menuAnchorY}}>
        <Menu.Item
          icon="pencil"
          title={I18n.t('action_edit')}
          onPress={() => {
            navigation.navigate('Operation', {
              operation: selectedOperation,
            });
            this.setState({isOperationMenuVisible: false});
          }}
        />
        <Menu.Item
          icon="delete"
          title={I18n.t('action_delete')}
          onPress={this.handleDeleteButton}
        />
      </Menu>
    );
  }

  handleDeleteButton = () => {
    const {selectedOperation} = this.state;
    this.setState({isOperationMenuVisible: false});
    const message = I18n.t('message_delete_operation');
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
            this.props.deleteOperation(selectedOperation);
          }
        },
      },
    ]);
  };
}

const deleteOperation = (
  operation: Operation,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.initOperationRepo();
  await storageHandler.deleteOperation(operation);
  const operations = await storageHandler.getAllOperationsFromRepo();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
};

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
});

const mapDispatchToProps = {
  deleteOperation: (operation: Operation) => deleteOperation(operation),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
