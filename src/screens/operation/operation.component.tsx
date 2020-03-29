import React, {useLayoutEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Operation from '../../entities/Operation';
import {Button, Checkbox, TouchableRipple} from 'react-native-paper';
import Input from '../../components/input/input';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import {saveOperation} from '../../utils/OperationUtils';
import {convertDate} from '../../utils/DateUtils';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';

type OperationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Operation'>;
  route: RouteProp<RootStackParamList, 'Operation'>;

  saveOperation: (operation: Operation) => void;
};

interface OperationState {
  amount: string;
  category: Category | null;
  timestamp: Date;
  note: string;
  isIgnored: boolean;

  amountError: string;
  categoryError: string;
  dateError: string;

  datePickerVisible: boolean;
}

const OperationScreen = (props: OperationProps) => {
  const {operation} = props.route.params;
  const {navigation, saveOperation} = props;
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
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [dateError, setDateError] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(operation ? 'operation_screen' : 'new_operation_screen'),
      headerRight: () => (
        <Button onPress={() => handleSaveButton()}>
          {I18n.t('action_save')}
        </Button>
      ),
    });
  });

  const handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
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
        await saveOperation(newOperation);
        await navigation.goBack();
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
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

  const hideAmountError = () => {
    setAmountError('');
  };

  const showAmountError = () => {
    setAmountError(I18n.t('label_required'));
  };

  const hideCategoryError = () => {
    setCategoryError('');
  };

  const showCategoryError = () => {
    setCategoryError(I18n.t('label_required'));
  };

  const hideDateError = () => {
    setDateError('');
  };

  const showDateError = () => {
    setDateError(I18n.t('label_required'));
  };

  const changeAmount = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      setAmount(amount);
    }
  };

  const changeCategory = (category: Category | null) => {
    setCategory(category);
  };

  const changeDate = (date: Date) => {
    setDate(date);
    setDatePickerVisible(false);
  };

  const changeNote = (note: string) => {
    setNote(note);
  };

  const changeIsIgnored = () => {
    setIsIgnored(!isIgnored);
  };

  const handleDateInputPress = () => {
    hideDateError();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
      <ScrollView>
        <Input
          label={I18n.t('label_amount')}
          value={amount}
          keyboardType="numeric"
          required={true}
          selectTextOnFocus={true}
          errorMessage={amountError}
          onFocus={hideAmountError}
          onChangeText={changeAmount}
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
          onInputPress={() => {
            hideCategoryError();
            navigation.navigate('Categories', {
              setCategory: changeCategory,
            });
          }}
        />
        <Input
          label={I18n.t('label_date')}
          value={convertDate(date)}
          required={true}
          editable={false}
          errorMessage={dateError}
          onFocus={hideDateError}
          hideClearButton={true}
          onInputPress={handleDateInputPress}
        />
        <Input
          label={I18n.t('label_note')}
          value={note}
          onChangeText={changeNote}
          multiline={true}
        />
        <TouchableRipple onPress={changeIsIgnored}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox status={isIgnored ? 'checked' : 'unchecked'} />
            <Text>{I18n.t('label_ignore')}</Text>
          </View>
        </TouchableRipple>
      </ScrollView>
      <DateTimePickerModal
        date={date}
        isVisible={datePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={changeDate}
        onCancel={hideDatePicker}
        headerTextIOS={I18n.t('label_choose_date')}
        cancelTextIOS={I18n.t('action_cancel')}
        confirmTextIOS={I18n.t('action_confirm')}
        locale={I18n.t('locale')}
      />
    </View>
  );
};

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  {
    saveOperation: (operation: Operation) => saveOperation(operation),
  },
)(OperationScreen);
