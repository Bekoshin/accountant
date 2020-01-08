import React, {SyntheticEvent} from 'react';
import {View, ScrollView, Platform} from 'react-native';
import {connect} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import {Button} from 'react-native-paper';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import Category from '../../../entities/Category';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../../storage/StorageHandler';
import {actionTypes} from '../../../store/actionTypes';
import moment from 'moment';

interface OperationProps {
  navigation: any;

  operation?: Operation;

  saveOperation: (operation: Operation) => void;
}

interface OperationState {
  amount: string;
  category: Category | null;
  date: Date | null;

  amountError: string;
  categoryError: string;
  dateError: string;

  datePickerVisible: boolean;
}

class OperationScreen extends React.PureComponent<
  OperationProps,
  OperationState
> {
  state = {
    amount: this.props.operation ? this.props.operation.amount.toString() : '0',
    category: this.props.operation ? this.props.operation.category : null,
    date: this.props.operation ? this.props.operation.date : new Date(),
    amountError: '',
    categoryError: '',
    dateError: '',
    datePickerVisible: false,
  };

  static navigationOptions = {
    title: I18n.t('operation_screen'),
    headerRight: () => (
      <Button onPress={() => {}}>{I18n.t('action_save')}</Button>
    ),
  };

  private handleSaveButton = async () => {
    // console.log('HANDLE SAVE BUTTON');
    // const {amount, category} = this.state;
    // if (this.checkFields()) {
    //   try {
    //     let operation = new Operation()
    //     let tegory;
    //     if (parentCategory) {
    //       //todo need check parentCategory for exist
    //       category = new Category(name, parentCategory);
    //     } else {
    //       category = new Category(name);
    //     }
    //     await this.props.saveCategory(category);
    //     this.props.navigation.goBack();
    //   } catch (error) {
    //     console.log('HANDLE SAVE BUTTON. ERROR: ', error);
    //   }
    // }
  };

  private checkFields = () => {
    let allFieldsFilled = true;
    if (!this.state.amount) {
      allFieldsFilled = false;
      this.showAmountError();
    }
    if (!this.state.category) {
      allFieldsFilled = false;
      this.showCategoryError();
    }
    if (!this.state.date) {
      allFieldsFilled = false;
      this.showDateError();
    }
    return allFieldsFilled;
  };

  private hideAmountError = () => {
    this.setState({amountError: ''});
  };

  private showAmountError = () => {
    this.setState({amountError: I18n.t('label_required')});
  };

  private hideCategoryError = () => {
    this.setState({categoryError: ''});
  };

  private showCategoryError = () => {
    this.setState({categoryError: I18n.t('label_required')});
  };

  private hideDateError = () => {
    this.setState({dateError: ''});
  };

  private showDateError = () => {
    this.setState({dateError: I18n.t('label_required')});
  };

  private changeAmount = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      this.setState({
        amount: amount,
      });
    }
  };

  changeCategory = (category: Category | null) => {
    this.setState({category: category});
  };

  changeDate = (date: Date | null) => {
    this.setState({date: date});
  };

  setDate = (
    event: SyntheticEvent<Readonly<{timestamp: number}>, Event>,
    date?: Date | undefined,
  ) => {
    console.log('date: ', date);
    date = date || this.state.date;

    this.setState({
      datePickerVisible: Platform.OS === 'ios',
      date,
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({saveButtonHandler: this.handleSaveButton});
    this.showDate();
    console.log('OPERATION DID MOUNT');
  }

  componentWillUnmount() {
    console.log('OPERATION WILL UNMOUNT');
  }

  render() {
    const {
      amount,
      category,
      date,
      amountError,
      categoryError,
      dateError,
      datePickerVisible,
    } = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
        <ScrollView>
          <Input
            label={I18n.t('label_amount')}
            value={amount.toString()}
            keyboardType="numeric"
            required={true}
            selectTextOnFocus={true}
            errorMessage={amountError}
            onFocus={this.hideAmountError}
            onChangeText={this.changeAmount}
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
            onFocus={this.hideCategoryError}
            hideClearButton={true}
            onInputPress={() => {
              this.hideCategoryError();
              this.props.navigation.navigate('Categories', {
                selectCategory: this.changeCategory,
              });
            }}
          />
          <Input
            label={I18n.t('label_date')}
            value={this.showDate()}
            required={true}
            editable={false}
            errorMessage={dateError}
            onFocus={this.hideDateError}
            hideClearButton={true}
            onInputPress={() => {
              this.hideDateError();
              this.setState({datePickerVisible: true});
            }}
          />
        </ScrollView>
        {datePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={this.setDate}
          />
        )}
      </View>
    );
  }

  showDate = () => {
    const date = this.state.date;
    if (date) {
      const today = new Date();
      if (this.compareDates(today, date)) {
        return I18n.t('today');
      }
      let yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (this.compareDates(yesterday, date)) {
        return I18n.t('yesterday');
      }
      return moment(date).format('LLL');
    }
    return '';
  };

  compareDates = (firstDate: Date, secondDate: Date) => {
    return !!(
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  };
}

const saveOperation = (
  operation: Operation,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.init();
  await storageHandler.saveOperationInRepo(operation);
  const operations = await storageHandler.getAllOperationsFromRepo();
  dispatch({
    type: actionTypes.OPERATIONS_LOADED,
    operations: operations,
  });
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {
    saveOperation: (operation: Operation) => saveOperation(operation),
  },
)(OperationScreen);
