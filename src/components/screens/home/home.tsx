import React from 'react';
import moment from 'moment';
import {Image, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';
import {FAB, List} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DateSelector from '../../dateSelector/dateSelector.Component';
import I18n from '../../../i18n/i18n';

export type UnitOfDate = 'isoWeek' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['isoWeek', 'month', 'year'];

interface HomeProps {
  navigation: any;

  operations: Operation[];
}

interface HomeState {
  open: boolean;
  selectedIndex: number;
  selectedDate: moment.Moment;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
  state = {
    open: false,
    selectedIndex: 1,
    selectedDate: moment(),
  };

  componentDidMount(): void {
    console.log('HOME DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  render() {
    const {operations} = this.props;
    let selectedIndex = this.state.selectedIndex;
    console.log('SELECTED DATE: ', this.state.selectedDate.toDate());
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <SegmentedControlTab
          values={['Неделя', 'Месяц', 'Год']}
          selectedIndex={selectedIndex}
          onTabPress={index =>
            this.setState({selectedIndex: index, selectedDate: moment()})
          }
        />
        <DateSelector
          type={UNITS_OF_DATE[selectedIndex]}
          date={this.state.selectedDate}
          changeDate={date => this.setState({selectedDate: date})}
        />
        {this.renderOperations()}
        {this.renderFAB()}
      </View>
    );
  }

  renderOperations() {
    const operations = this.props.operations;
    console.log('OPERATIONS: ', operations);
    let operationComponents = [];
    for (let operation of operations) {
      if (this.isOperationDateInSelectedInterval(operation)) {
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
    }

    if (operationComponents.length > 0) {
      return <ScrollView>{operationComponents}</ScrollView>;
    } else {
      return <NoExpensesComponent />;
    }
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
        open={this.state.open}
        onStateChange={({open}) => this.setState({open})}
      />
    );
  }

  private isOperationDateInSelectedInterval = (operation: Operation) => {
    const {selectedIndex, selectedDate} = this.state;
    const startOfInterval = selectedDate.startOf(UNITS_OF_DATE[selectedIndex]);
    const endOfInterval = selectedDate.endOf(UNITS_OF_DATE[selectedIndex]);
    return moment(operation.date).isBetween(
      startOfInterval,
      endOfInterval,
      UNITS_OF_DATE[selectedIndex],
      '[]',
    );
  };
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
