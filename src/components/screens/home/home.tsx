import React from 'react';
import moment from 'moment';
import {Image, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';
import {Button, FAB, List} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DateSelector from '../../dateSelector/dateSelector.Component';
import I18n from '../../../i18n/i18n';
import DateHandler from '../../../utils/DateHandler';
import OperationHandler from '../../../utils/OperationHandler';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];

interface HomeProps {
  navigation: any;

  operations: Operation[];
}

interface HomeState {
  fabIsOpen: boolean;
  selectedIndex: number;
  selectedDate: moment.Moment;
  operationsMap: Map<string, Operation[]>;
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
    this.setTotalToParam(
      OperationHandler.calculateTotalAmount(filteredOperations),
    );
    const operationsMap = OperationHandler.groupByDate(filteredOperations);
    this.state = {
      fabIsOpen: false,
      selectedIndex: 1,
      selectedDate: selectedDate,
      operationsMap: operationsMap,
    };
  }

  static navigationOptions = ({navigation}: any) => {
    let params = navigation.state.params;
    const total = params && params.total !== undefined ? params.total : '0';
    return {
      title: I18n.t('label_total') + ': ' + total + ' ₽',
      headerRight: () => (
        <Button onPress={() => params.saveButtonHandler()}>
          {I18n.t('action_save')}
        </Button>
      ),
    };
  };

  setTotalToParam = (total: number) => {
    this.props.navigation.setParams({total: total});
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
  ) => {
    const filteredOperations = OperationHandler.filterOperationsByDate(
      this.props.operations,
      selectedDate,
      UNITS_OF_DATE[selectedIndex],
    );
    this.setTotalToParam(
      OperationHandler.calculateTotalAmount(filteredOperations),
    );
    const operationsMap = OperationHandler.groupByDate(filteredOperations);
    this.setState({operationsMap: operationsMap});
  };

  render() {
    let selectedIndex = this.state.selectedIndex;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
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

  renderOperationSections() {
    const {operationsMap} = this.state;
    let operationComponents: any = [];
    operationsMap.forEach((operations: Operation[]) => {
      if (operations.length > 0) {
        operationComponents.push(
          <List.Section key={operations[0].date.toString()}>
            <List.Subheader>
              {DateHandler.convertDate(operations[0].date)}
            </List.Subheader>
            {this.renderOperations(operations)}
          </List.Section>,
        );
      }
    });

    if (operationComponents.length > 0) {
      return <ScrollView>{operationComponents}</ScrollView>;
    } else {
      return <NoExpensesComponent />;
    }
  }

  renderOperations(operations: Operation[]) {
    let operationComponents = [];
    for (let operation of operations) {
      operationComponents.push(
        <List.Item
          key={operation.id}
          title={I18n.t(operation.category.name, {
            defaultValue: operation.category.name,
          })}
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
      <FAB.Group
        actions={[
          {
            icon: 'check',
            label: 'add operation',
            onPress: () => {
              this.props.navigation.navigate('Operation');
            },
          },
        ]}
        icon="plus"
        visible={true}
        open={this.state.fabIsOpen}
        onStateChange={({open}) => this.setState({fabIsOpen: open})}
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
