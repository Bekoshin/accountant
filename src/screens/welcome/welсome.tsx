import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import StorageHandler from '../../../storage/StorageHandler';
import Operation from '../../../entities/Operation';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../../store/ACTION_TYPES';
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
    await this._storageHandler.initCategoryRepo();
    await this._storageHandler.initOperationRepo();
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
  let operations: Operation[] = await storageHandler.getAllOperationsFromRepo();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
};

const loadAllCategories = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let categories: Category[] = await storageHandler.getAllValidCategoriesFromRepo();
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
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
