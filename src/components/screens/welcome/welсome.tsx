import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import StorageHandler from '../../../storage/StorageHandler';
import Operation from '../../../entities/Operation';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {actionTypes} from '../../../store/actionTypes';

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
  let expenses: Operation[] = await storageHandler.getAllExpensesFromRepo();
  dispatch({
    type: actionTypes.EXPENSES_LOADED,
    expenses: expenses,
  });
};

const mapStateToProps = (state: AppState) => ({
});

export default connect(
  mapStateToProps,
  {
    loadAllExpenses: (storageHandler: StorageHandler) =>
      loadAllExpenses(storageHandler),
  },
)(Welcome);
