import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import StorageHandler from '../../../storage/StorageHandler';
import Operation from '../../../entities/Operation';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {actionTypes} from '../../../store/actionTypes';
import Category from '../../../entities/Category';

export interface WelcomeProps {
  navigation: any;

  loadAllOperations: (storageHandler: StorageHandler) => void;
  loadAllCategories: (storageHandler: StorageHandler) => void;
}

class Welcome extends React.PureComponent<WelcomeProps> {
  _storageHandler: StorageHandler | undefined;

  async componentDidMount() {
    console.log('WELCOME DID MOUNT');
    this._storageHandler = new StorageHandler();
    await this._storageHandler.connect();
    await this._storageHandler.init();
    console.log('WELCOME. STORAGE HANDLER INITIALIZED');
    await this.props.loadAllOperations(this._storageHandler);
    await this.props.loadAllCategories(this._storageHandler);

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

const loadAllOperations = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let operations: Map<
    Date,
    Operation[]
  > = await storageHandler.getAllOperationsFromRepo();
  dispatch({
    type: actionTypes.OPERATIONS_LOADED,
    operations: operations,
  });
};

const loadAllCategories = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let categories: Category[] = await storageHandler.getAllCategoriesFromRepo();
  dispatch({
    type: actionTypes.CATEGORIES_LOADED,
    categories: categories,
  });
};

const mapStateToProps = (state: AppState) => ({
});

export default connect(
  mapStateToProps,
  {
    loadAllOperations: (storageHandler: StorageHandler) =>
      loadAllOperations(storageHandler),
    loadAllCategories: (storageHandler: StorageHandler) =>
      loadAllCategories(storageHandler),
  },
)(Welcome);
