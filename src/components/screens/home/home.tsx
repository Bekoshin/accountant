import React from 'react';
import moment from 'moment';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';
import {FAB} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DateSelector from '../../dateSelector/dateSelector.Component';

export type UnitOfDate = 'week' | 'month' | 'year';
const UNITS_OF_DATE: UnitOfDate[] = ['week', 'month', 'year'];

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
        {operations.length > 0 ? <Text>Home</Text> : <NoExpensesComponent />}
        {this.renderFAB()}
      </View>
    );
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
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operation.operations,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
