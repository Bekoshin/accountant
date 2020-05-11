import React, {useEffect, useState} from 'react';
import {View, ScrollView, SafeAreaView, Alert} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';
import Input from '../../components/input/input';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import Subscription from '../../entities/Subscription';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {GeneralAppBar} from '../../components/appBars/generalAppBar/generalAppBar.component';
import {
  createOperationBySubscription,
  needToCreateOperation,
} from '../../utils/SubscriptionUtils';
import Operation from '../../entities/Operation';
import {saveOperation} from '../../utils/OperationUtils';

type SubscriptionScreenProps = {
  route: RouteProp<RootStackParamList, 'Subscription'>;
  navigation: StackNavigationProp<RootStackParamList, 'Subscription'>;
  saveSubscription: (subscription: Subscription) => Promise<void>;
  createOperation: (operation: Operation) => void;
};

const SubscriptionScreen = (props: SubscriptionScreenProps) => {
  const {navigation, route, createOperation} = props;
  const {subscription, selectedCategory} = route.params;

  const [name, setName] = useState<string>(
    subscription ? subscription.name : '',
  );
  const [value, setValue] = useState<string>(
    subscription ? subscription.value.toString() : '',
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
  const [nameError, setNameError] = useState<string>('');
  const [valueError, setValueError] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');
  const [dayError, setDayError] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const hideNameError = () => {
    setNameError('');
  };

  const showNameError = () => {
    setNameError(I18n.t('label_required'));
  };

  const hideValueError = () => {
    setValueError('');
  };

  const showValueError = () => {
    setValueError(I18n.t('label_required'));
  };

  const hideCategoryError = () => {
    setCategoryError('');
  };

  const showCategoryError = () => {
    setCategoryError(I18n.t('label_required'));
  };

  const hideDayError = () => {
    setDayError('');
  };

  const showDayError = () => {
    setDayError(I18n.t('label_required'));
  };

  const changeValue = (newValue: string) => {
    if (newValue.match(/^\d*\.?\d*$/)) {
      setValue(newValue);
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
      canSetSeveralCategory: false,
      previousScreen: 'Subscription',
    });
  };

  const checkFields = () => {
    let allFieldsFilled = true;
    if (!name) {
      allFieldsFilled = false;
      showNameError();
    }
    if (!value || value === '0') {
      allFieldsFilled = false;
      showValueError();
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

  const handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    if (checkFields()) {
      try {
        let newSubscription: Subscription;
        newSubscription = new Subscription(
          name,
          category as Category,
          parseFloat(value),
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
    <View style={{flex: 1}}>
      <GeneralAppBar
        title={I18n.t(
          subscription ? 'subscription_screen' : 'new_subscription_screen',
        )}
        onBackButtonPress={navigation.goBack}
        onSaveButtonPress={handleSaveButton}
      />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
          <ScrollView bounces={false}>
            <Input
              label={I18n.t('label_name')}
              value={name}
              required={true}
              errorMessage={nameError}
              onFocus={hideNameError}
              onChangeText={setName}
            />
            <Input
              label={I18n.t('label_value')}
              value={value}
              keyboardType="numeric"
              required={true}
              selectTextOnFocus={true}
              errorMessage={valueError}
              onFocus={hideValueError}
              onChangeText={changeValue}
            />
            <Input
              label={I18n.t('label_category')}
              value={
                category
                  ? I18n.t(category.name, {
                      defaultValue: category.name,
                    })
                  : ''
              }
              required={true}
              editable={false}
              errorMessage={categoryError}
              onFocus={hideCategoryError}
              hideClearButton={true}
              onInputPress={handleCategoryInputPress}
            />
            <Input
              label={I18n.t('label_day')}
              value={day}
              keyboardType="numeric"
              required={true}
              selectTextOnFocus={true}
              errorMessage={dayError}
              onFocus={hideDayError}
              onChangeText={changeDay}
            />
            <Input
              label={I18n.t('label_note')}
              value={note}
              onChangeText={setNote}
              multiline={true}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const saveSubscription = (
  subscription: Subscription,
): ThunkAction<
  Promise<void>,
  AppState,
  null,
  Action<string>
> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.initSubscriptionRepo();
  await storageHandler.saveSubscription(subscription);
  const subscriptions = await storageHandler.getAllSubscriptions();
  await dispatch({
    type: ACTION_TYPES.SUBSCRIPTIONS_LOADED,
    subscriptions: subscriptions,
  });
};

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  {
    saveSubscription: (subscription: Subscription) =>
      saveSubscription(subscription),
    createOperation: (operation: Operation) => saveOperation(operation),
  },
)(SubscriptionScreen);
