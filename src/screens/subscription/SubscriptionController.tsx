import React, {useEffect, useLayoutEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import Subscription from '../../entities/Subscription';
import Operation from '../../entities/Operation';
import Category from '../../entities/Category';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import I18n from '../../i18n/i18n';
import {
  createOperationBySubscription,
  needToCreateOperation,
} from '../../utils/SubscriptionUtils';
import {Alert} from 'react-native';
import {SubscriptionView} from './SubscriptionView';
import {ThunkAction} from 'redux-thunk';
import {AppState} from '../../store/store';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import {connect} from 'react-redux';
import {saveOperation} from '../../utils/OperationUtils';

type SubscriptionControllerProps = {
  route: RouteProp<RootStackParamList, 'Subscription'>;
  navigation: StackNavigationProp<RootStackParamList, 'Subscription'>;
  saveSubscription: (subscription: Subscription) => Promise<void>;
  createOperation: (operation: Operation) => void;
};

const SubscriptionController = (props: SubscriptionControllerProps) => {
  const {navigation, route, createOperation} = props;
  const {subscription, selectedCategory} = route.params;

  const [name, setName] = useState<string>(
    subscription ? subscription.name : '',
  );
  const [amount, setAmount] = useState<string>(
    subscription ? subscription.amount.toString() : '',
  );
  const [category, setCategory] = useState<Category | null>(
    subscription ? subscription.category : null,
  );
  const [day, setDay] = useState<string>(
    subscription ? subscription.day.toString() : '',
  );
  const [note, setNote] = useState<string>(
    subscription ? subscription.note : '',
  );
  const [nameError, setNameError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [dayError, setDayError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t(
            subscription ? 'subscription_screen' : 'new_subscription_screen',
          )}
        />
      ),
    });
  }, [navigation, subscription]);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const hideNameError = () => {
    setNameError(false);
  };

  const showNameError = () => {
    setNameError(true);
  };

  const hideAmountError = () => {
    setAmountError(false);
  };

  const showAmountError = () => {
    setAmountError(true);
  };

  const hideCategoryError = () => {
    setCategoryError(false);
  };

  const showCategoryError = () => {
    setCategoryError(true);
  };

  const hideDayError = () => {
    setDayError(false);
  };

  const showDayError = () => {
    setDayError(true);
  };

  const changeAmount = (newAmount: string) => {
    if (newAmount.match(/^\d*\.?\d*$/)) {
      setAmount(newAmount);
    }
  };

  const changeDay = (newDay: string) => {
    if (newDay.match(/^\d+$/)) {
      const num = parseInt(newDay, 10);
      if (num > 0 && num <= 31) {
        setDay(newDay);
      }
    } else if (newDay === '') {
      setDay(newDay);
    }
  };

  const handleCategoryInputPress = () => {
    hideCategoryError();
    navigation.navigate('Categories', {
      previousScreen: 'Subscription',
    });
  };

  const checkFields = () => {
    let allFieldsFilled = true;
    if (!name) {
      allFieldsFilled = false;
      showNameError();
    }
    if (!amount || amount === '0') {
      allFieldsFilled = false;
      showAmountError();
    }
    if (!category) {
      allFieldsFilled = false;
      showCategoryError();
    }
    if (!day) {
      allFieldsFilled = false;
      showDayError();
    }
    return allFieldsFilled;
  };

  const handleSaveButtonPress = async () => {
    if (checkFields()) {
      try {
        let newSubscription: Subscription;
        newSubscription = new Subscription(
          name,
          category as Category,
          parseFloat(amount),
          parseInt(day, 10),
          note,
          subscription ? subscription.id : undefined,
        );
        await props.saveSubscription(newSubscription);
        if (await needToCreateOperation(newSubscription)) {
          const message = I18n.t('message_create_operation');
          Alert.alert(I18n.t('label_operation_adding'), message, [
            {
              text: I18n.t('action_no'),
              onPress: navigation.goBack,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                const operation: Operation = createOperationBySubscription(
                  newSubscription,
                );
                createOperation(operation);
                navigation.goBack();
              },
            },
          ]);
        } else {
          navigation.goBack();
        }
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
  };

  return (
    <SubscriptionView
      name={name}
      changeName={setName}
      nameError={nameError}
      hideNameError={hideNameError}
      amount={amount}
      changeAmount={changeAmount}
      amountError={amountError}
      hideAmountError={hideAmountError}
      category={category}
      onCategoryInputPress={handleCategoryInputPress}
      categoryError={categoryError}
      hideCategoryError={hideCategoryError}
      day={day}
      changeDay={changeDay}
      dayError={dayError}
      hideDayError={hideDayError}
      note={note}
      changeNote={setNote}
      onSaveButtonPress={handleSaveButtonPress}
    />
  );
};

const saveSubscription = (
  subscription: Subscription,
): ThunkAction<Promise<void>, AppState, null, Action<string>> => async (
  dispatch,
) => {
  let storageHandler = await StorageHandler.getInstance();
  await storageHandler.saveSubscription(subscription);
  const subscriptions = await storageHandler.getAllSubscriptions();
  await dispatch({
    type: ACTION_TYPES.SUBSCRIPTIONS_LOADED,
    subscriptions: subscriptions,
  });
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  saveSubscription: (subscription: Subscription) =>
    saveSubscription(subscription),
  createOperation: (operation: Operation) => saveOperation(operation),
})(SubscriptionController);
