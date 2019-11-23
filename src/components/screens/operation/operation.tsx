import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';

export interface OperationProps {
  navigation: any;

  operations: Operation[];
}

class OperationScreen extends React.PureComponent<OperationProps> {
  componentDidMount(): void {
    console.log('OPERATION DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('OPERATION WILL UNMOUNT');
  }

  render() {
    const {operations} = this.props;

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {operations.length > 0 ? <Text>Operation</Text> : <NoExpensesComponent />}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operation.operations,
});

export default connect(
  mapStateToProps,
  {},
)(OperationScreen);
