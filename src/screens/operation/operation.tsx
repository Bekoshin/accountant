import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableHighlight,
  Switch,
} from 'react-native';
import {connect} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Operation from '../../entities/Operation';
import {Checkbox, TouchableRipple} from 'react-native-paper';
import {Input} from '../../components/input/Input';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import {saveOperation} from '../../utils/OperationUtils';
import {convertDate} from '../../utils/DateUtils';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import {GeneralAppBar} from '../../components/appBars/generalAppBar/generalAppBar';
import {styles} from './styles';
import {COLORS} from '../../constants/colors';

type OperationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Operation'>;
  route: RouteProp<RootStackParamList, 'Operation'>;

  saveOperation: (operation: Operation) => void;
};

const OperationScreen = (props: OperationProps) => {
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
  const [datePickerVisible, setDatePickerVisible] = useState(false);

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

  const changeDate = (newDate: Date) => {
    setDatePickerVisible(false);
    setDate(newDate);
  };

  const changeNote = (newNote: string) => {
    setNote(newNote);
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
        await props.saveOperation(newOperation);
        await navigation.goBack();
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
  };

  const handleCategoryInputPress = () => {
    hideCategoryError();
    navigation.navigate('Categories', {
      previousScreen: 'Operation',
    });
  };

  return (
    <View style={styles.mainContainer}>
      <GeneralAppBar
        onBackButtonPress={navigation.goBack}
        onSaveButtonPress={handleSaveButton}
        title={I18n.t(operation ? 'operation_screen' : 'new_operation_screen')}
      />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          {isBySubscription ? (
            <View style={{alignItems: 'flex-end'}}>
              <View
                style={{
                  padding: 4,
                  backgroundColor: 'orange',
                  borderRadius: 6,
                }}>
                <Text>{I18n.t('label_by_subscription')}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_amount')}</Text>
            <Input
              value={amount}
              keyboardType="numeric"
              selectTextOnFocus={true}
              error={amountError}
              onFocus={hideAmountError}
              onChangeText={changeAmount}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_category')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={handleCategoryInputPress}
              activeOpacity={0.9}
              underlayColor={COLORS.PRIMARY_DARK}>
              <Input
                value={
                  category
                    ? I18n.t(category.name, {
                        defaultValue: category.name,
                      })
                    : ''
                }
                editable={false}
                error={categoryError}
                onFocus={hideCategoryError}
                onChangeText={() => {}}
                pointerEvents="none"
                placeholder={I18n.t('placeholder_select_category')}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_date')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={handleDateInputPress}
              activeOpacity={0.9}
              underlayColor={COLORS.PRIMARY_DARK}>
              <Input
                value={convertDate(date)}
                editable={false}
                error={dateError}
                pointerEvents="none"
                onFocus={hideDateError}
                onChangeText={() => {}}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_note')}</Text>
            <Input
              value={note}
              onChangeText={changeNote}
              multiline={true}
              placeholder={I18n.t('placeholder_write_note')}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.switchLabel,
                {
                  color: isIgnored
                    ? COLORS.PRIMARY_DARK
                    : COLORS.SECONDARY_DARK_1,
                },
              ]}>
              {I18n.t('label_ignore')}
            </Text>
            <Switch
              thumbColor="white"
              trackColor={{false: COLORS.BACKGROUND_1, true: COLORS.PRIMARY}}
              ios_backgroundColor={COLORS.BACKGROUND_1}
              value={isIgnored}
              onValueChange={changeIsIgnored}
            />
          </View>
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
      </SafeAreaView>
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
