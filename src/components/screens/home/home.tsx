import React from 'react';
import moment from 'moment';
import {Image, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';
import {FAB, Menu, List, Appbar, Searchbar} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DateSelector from '../../dateSelector/dateSelector.Component';
import I18n from '../../../i18n/i18n';
import DateHandler from '../../../utils/DateHandler';
import OperationHandler from '../../../utils/OperationHandler';
import styles from './home.styles';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];

interface HomeProps {
  navigation: any;

  operations: Operation[];
}

interface HomeState {
  selectedIndex: number;
  selectedDate: moment.Moment;
  operationsMap: Map<string, Operation[]>;
  total: number;
  isMoreMenuVisible: boolean;
  groupedBy: 'date' | 'category';
  searchMode: boolean;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    const selectedDate = moment();
    const selectedIndex = 1;
    const filteredOperations = OperationHandler.filterOperationsByDate(
      this.props.operations,
      selectedDate,
      UNITS_OF_DATE[selectedIndex],
    );
    const operationsMap = OperationHandler.groupByDate(filteredOperations);
    this.state = {
      selectedIndex: 1,
      selectedDate: selectedDate,
      operationsMap: operationsMap,
      total: OperationHandler.calculateTotalAmount(filteredOperations),
      isMoreMenuVisible: false,
      groupedBy: 'date',
      searchMode: false,
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

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  handleIndexChanged = (index: number) => {
    this.setState({selectedIndex: index, selectedDate: moment()});
    this.updateVisibleOperations(this.state.selectedDate, index);
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
    const filteredOperations = OperationHandler.filterOperationsByDate(
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
        operationsMap = OperationHandler.groupByMonth(filteredOperations);
      } else {
        operationsMap = OperationHandler.groupByDate(filteredOperations);
      }
    } else {
      operationsMap = OperationHandler.groupByCategory(filteredOperations);
    }
    this.setState({
      operationsMap: operationsMap,
      total: OperationHandler.calculateTotalAmount(filteredOperations),
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
            this.props.navigation.navigate('Operation', {
              operation: operation,
            })
          }
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
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
