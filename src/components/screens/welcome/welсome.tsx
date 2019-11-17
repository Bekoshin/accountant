import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import StorageHandler from '../../../storage/StorageHandler';
import Expense from '../../../entities/Expense';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';

export interface WelcomeProps {
  navigation: any;

  loadAllExpenses: (storageHandler: StorageHandler) => void;
}

class Welcome extends React.PureComponent<WelcomeProps> {
  _storageHandler: StorageHandler | undefined;

  async componentDidMount() {
    console.log('WELCOME DID MOUNT');
    this._storageHandler = new StorageHandler();
    await this._storageHandler.init();
    await this.props.loadAllExpenses(this._storageHandler);

    this.props.navigation.navigate('App');
  }

  componentWillUnmount(): void {
    console.log('WELCOME WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Welcome Screen</Text>
      </View>
    );
  }
}

const loadAllExpenses = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let expenses: Expense[] = await storageHandler.getAllExpensesFromRepo();
  console.log('expenses: ', expenses);
};


const mapStateToProps = (state: AppState) => ({
  expenses: state.expense.expenses,
});

export default connect(
  mapStateToProps,
  {
    loadAllExpenses: (storageHandler: StorageHandler) =>
      loadAllExpenses(storageHandler),
  },
)(Welcome);
