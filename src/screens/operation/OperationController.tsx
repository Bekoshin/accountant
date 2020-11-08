import React, {useEffect, useLayoutEffect, useState} from 'react';
import {connect} from 'react-redux';
import Operation from '../../entities/Operation';
import {saveOperation} from '../../utils/OperationUtils';
import {OperationView} from './OperationView';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import {styles} from './styles';
import {Header} from '../../components/header/Header';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';

type OperationControllerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Operation'>;
  route: RouteProp<RootStackParamList, 'Operation'>;

  saveOperation: (operation: Operation) => void;
};

const OperationController = (props: OperationControllerProps) => {
  const {operation, selectedCategory} = props.route.params;
  const {navigation} = props;

  const isBySubscription = operation ? !!operation.subscriptionId : false;
  const [amount, setAmount] = useState(
    operation ? operation.amount.toString() : '0',
  );
  const [category, setCategory] = useState(
    operation ? operation.category : null,
  );
  const [date, setDate] = useState(operation ? operation.date : new Date());
  const [note, setNote] = useState(operation ? operation.note : '');
  const [isIgnored, setIsIgnored] = useState(
    operation ? operation.isIgnored : false,
  );
  const [amountError, setAmountError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [dateError, setDateError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: styles.headerRightContainer,
      headerRight: () => (
        <Header
          onBackButtonPress={navigation.goBack}
          title={I18n.t(
            operation ? 'operation_screen' : 'new_operation_screen',
          )}
        />
      ),
    });
  }, [navigation, operation]);

  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

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

  const hideDateError = () => {
    setDateError(false);
  };

  const showDateError = () => {
    setDateError(true);
  };

  const changeAmount = (newAmount: string) => {
    if (newAmount.match(/^\d*\.?\d*$/)) {
      setAmount(newAmount);
    }
  };

  const handleCategoryInputPress = () => {
    hideCategoryError();
    navigation.navigate('Categories', {
      previousScreen: 'Operation',
    });
  };

  const changeIsIgnored = () => {
    setIsIgnored(!isIgnored);
  };

  const allFieldsIsFilled = () => {
    let allFieldsFilled = true;
    if (!amount || amount === '0') {
      allFieldsFilled = false;
      showAmountError();
    }
    if (!category) {
      allFieldsFilled = false;
      showCategoryError();
    }
    if (!date) {
      allFieldsFilled = false;
      showDateError();
    }
    return allFieldsFilled;
  };

  const handleSaveButtonPress = async () => {
    if (allFieldsIsFilled()) {
      try {
        let newOperation: Operation = new Operation(
          parseFloat(amount),
          category as Category,
          +date,
          note,
          isIgnored,
          operation ? operation.subscriptionId : null,
          undefined,
          operation ? operation.id : undefined,
        );
        await props.saveOperation(newOperation);
        await navigation.goBack();
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
  };

  return (
    <OperationView
      amount={amount}
      changeAmount={changeAmount}
      amountError={amountError}
      hideAmountError={hideAmountError}
      category={category}
      onCategoryInputPress={handleCategoryInputPress}
      categoryError={categoryError}
      hideCategoryError={hideCategoryError}
      date={date}
      changeDate={setDate}
      dateError={dateError}
      hideDateError={hideDateError}
      note={note}
      changeNote={setNote}
      isIgnored={isIgnored}
      changeIsIgnored={changeIsIgnored}
      isBySubscription={isBySubscription}
      onSaveButtonPress={handleSaveButtonPress}
    />
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  saveOperation: (operation: Operation) => saveOperation(operation),
})(OperationController);
