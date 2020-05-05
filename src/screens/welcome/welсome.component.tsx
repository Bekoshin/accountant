import React, {useEffect, useState} from 'react';
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
  needToCreateOperation,
} from '../../utils/SubscriptionUtils';
import {saveOperation} from '../../utils/OperationUtils';

type WelcomeProps = {
  subscriptions: Subscription[];

  setInitialized: (initialized: boolean) => void;

  loadAllOperations: (storageHandler: StorageHandler) => void;
  loadAllCategories: (storageHandler: StorageHandler) => void;
  loadAllSubscriptions: (storageHandler: StorageHandler) => void;
  createOperation: (operation: Operation) => void;
};

const WelcomeScreen = (props: WelcomeProps) => {
  const {
    subscriptions,
    setInitialized,
    loadAllOperations,
    loadAllCategories,
    loadAllSubscriptions,
    createOperation,
  } = props;

  const [storageConnected, setStorageConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const _storageHandler: StorageHandler = new StorageHandler();
      await _storageHandler.connect();
      setStorageConnected(true);
      await _storageHandler.initCategoryRepo();
      await _storageHandler.initOperationRepo();
      await _storageHandler.initSubscriptionRepo();
      console.log('WELCOME. STORAGE HANDLER INITIALIZED');

      await loadAllOperations(_storageHandler);
      await loadAllCategories(_storageHandler);
      await loadAllSubscriptions(_storageHandler);
    };

    loadData();
  }, [
    loadAllCategories,
    loadAllOperations,
    loadAllSubscriptions,
  ]);

  useEffect(() => {
    const createTodaysMonthlyOperations = async () => {
      for (let subscription of subscriptions) {
        if (await needToCreateOperation(subscription)) {
          const operation: Operation = createOperationBySubscription(
            subscription,
          );
          createOperation(operation);
        }
      }
      await setInitialized(true);
    };
    if (storageConnected) {
      createTodaysMonthlyOperations();
    }
  }, [createOperation, setInitialized, storageConnected, subscriptions]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Welcome Screen</Text>
    </View>
  );
};

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
    createOperation: (operation: Operation) => saveOperation(operation),
  },
)(WelcomeScreen);
