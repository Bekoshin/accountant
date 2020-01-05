import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpensesComponent from '../../noExpenses/noExpenses.Component';
import {Button, TextInput, TouchableRipple} from 'react-native-paper';

interface OperationProps {
  navigation: any;

  operations: Operation[];
}

class OperationScreen extends React.PureComponent<OperationProps> {
  static navigationOptions = {
    title: 'Операция',
    headerRight: () => <Button onPress={() => {
    }}>Сохранить</Button>,
  };

  componentDidMount(): void {
    console.log('OPERATION DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('OPERATION WILL UNMOUNT');
  }

  render() {
    const {operations} = this.props;

    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <TextInput label="Сумма"/>
        <TouchableRipple
          onPress={() => this.props.navigation.navigate('Categories')}>
          <Text>Выберите категорию</Text>
        </TouchableRipple>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operationReducer.operations,
});

export default connect(
  mapStateToProps,
  {},
)(OperationScreen);
