import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import StorageHandler from '../../storage/StorageHandler';
import Operation from '../../entities/Operation';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import Category from '../../entities/Category';
import Subscription from '../../entities/Subscription';
import {
  createOperationBySubscription,
  todayIsRecordDay,
} from '../../utils/SubscriptionUtils';
import {saveOperation} from '../../utils/OperationUtils';

export interface WelcomeProps {
  navigation: any;

  subscriptions: Subscription[];

  loadAllOperations: (storageHandler: StorageHandler) => void;
  loadAllCategories: (storageHandler: StorageHandler) => void;
  loadAllSubscriptions: (storageHandler: StorageHandler) => void;
  saveOperation: (operation: Operation) => void;
}

class Welcome extends React.PureComponent<WelcomeProps> {
  _storageHandler: StorageHandler | undefined;

  async componentDidMount() {
    console.log('WELCOME DID MOUNT');
    this._storageHandler = new StorageHandler();
    await this._storageHandler.connect();
    await this._storageHandler.initCategoryRepo();
    await this._storageHandler.initOperationRepo();
    await this._storageHandler.initSubscriptionRepo();
    console.log('WELCOME. STORAGE HANDLER INITIALIZED');
    await this.props.loadAllOperations(this._storageHandler);
    await this.props.loadAllCategories(this._storageHandler);
    await this.props.loadAllSubscriptions(this._storageHandler);

    await this.createTodaysMonthlyOperations();

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

  createTodaysMonthlyOperations = async () => {
    const {subscriptions} = this.props;
    for (let subscription of subscriptions) {
      if (
        !subscription.recordedThisMonth &&
        todayIsRecordDay(subscription.day)
      ) {
        const operation: Operation = createOperationBySubscription(
          subscription,
        );
        this.props.saveOperation(operation);
      }
    }
  };
}

const loadAllOperations = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let operations: Operation[] = await storageHandler.getAllOperations();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
    operations: operations,
  });
};

const loadAllCategories = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let categories: Category[] = await storageHandler.getAllValidCategories();
  dispatch({
    type: ACTION_TYPES.CATEGORIES_LOADED,
    categories: categories,
  });
};

const loadAllSubscriptions = (
  storageHandler: StorageHandler,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let subscriptions: Subscription[] = await storageHandler.getAllSubscriptions();
  dispatch({
    type: ACTION_TYPES.SUBSCRIPTIONS_LOADED,
    subscriptions: subscriptions,
  });
};

const mapStateToProps = (state: AppState) => ({
  subscriptions: state.subscriptionReducer.subscriptions,
});

export default connect(
  mapStateToProps,
  {
    loadAllOperations: (storageHandler: StorageHandler) =>
      loadAllOperations(storageHandler),
    loadAllCategories: (storageHandler: StorageHandler) =>
      loadAllCategories(storageHandler),
    loadAllSubscriptions: (storageHandler: StorageHandler) =>
      loadAllSubscriptions(storageHandler),
    saveOperation: (operation: Operation) => saveOperation(operation),
  },
)(Welcome);
