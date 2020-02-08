import React, {SyntheticEvent} from 'react';
import {View, ScrollView, Platform, Text} from 'react-native';
import {connect} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import {Button, Checkbox, TouchableRipple} from 'react-native-paper';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import Category from '../../../entities/Category';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../../storage/StorageHandler';
import {actionTypes} from '../../../store/actionTypes';
import DateHandler from '../../../utils/DateHandler';

interface OperationProps {
  navigation: any;

  saveOperation: (operation: Operation) => void;
}

interface OperationState {
  amount: string;
  category: Category | null;
  date: Date;
  note: string;
  isIgnored: boolean;

  amountError: string;
  categoryError: string;
  dateError: string;

  datePickerVisible: boolean;
}

class OperationScreen extends React.PureComponent<OperationProps,
  OperationState> {
  private readonly operation: Operation | undefined = undefined;

  constructor(props: OperationProps) {
    super(props);
    this.operation = props.navigation.getParam('operation');
    this.state = {
      amount: this.operation ? this.operation.amount.toString() : '0',
      category: this.operation ? this.operation.category : null,
      date: this.operation ? this.operation.date : new Date(),
      note: this.operation ? this.operation.note : '',
      isIgnored: this.operation ? this.operation.isIgnored : false,
      amountError: '',
      categoryError: '',
      dateError: '',
      datePickerVisible: false,
    };
  }

  static navigationOptions = ({navigation}: any) => {
    let params = navigation.state.params;
    console.log('params: ', params);
    return {
      title: I18n.t(
        params && params.operation
          ? 'operation_screen'
          : 'new_operation_screen',
      ),
      headerRight: () => (
        <Button onPress={() => params.saveButtonHandler()}>
          {I18n.t('action_save')}
        </Button>
      ),
    };
  };

  private handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    const {amount, category, date, note, isIgnored} = this.state;
    if (this.checkFields()) {
      try {
        let operation: Operation;
        operation = new Operation(
          parseFloat(amount),
          category as Category,
          date,
          note,
          isIgnored,
          undefined,
          this.operation ? this.operation.id : undefined,
        );
        await this.props.saveOperation(operation);
        await this.props.navigation.goBack();
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
  };

  private checkFields = () => {
    let allFieldsFilled = true;
    if (!this.state.amount || this.state.amount === '0') {
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

  changeDate = (
    event: SyntheticEvent<Readonly<{ timestamp: number }>, Event>,
    date?: Date | undefined,
  ) => {
    console.log('date: ', date);
    date = date || this.state.date;

    this.setState({
      datePickerVisible: Platform.OS === 'ios',
      date,
    });
  };

  changeNote = (note: string) => {
    this.setState({note: note});
  };

  changeIsIgnored = () => {
    this.setState({isIgnored: !this.state.isIgnored});
  };

  componentDidMount() {
    this.props.navigation.setParams({saveButtonHandler: this.handleSaveButton});
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
      note,
      isIgnored,
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
            value={amount}
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
                setCategory: this.changeCategory,
              });
            }}
          />
          <Input
            label={I18n.t('label_date')}
            value={DateHandler.convertDate(this.state.date)}
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
          <Input
            label={I18n.t('label_note')}
            value={note}
            onChangeText={this.changeNote}
            multiline={true}
          />
          <TouchableRipple onPress={this.changeIsIgnored}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Checkbox status={isIgnored ? 'checked' : 'unchecked'}/>
              <Text>{I18n.t('label_ignore')}</Text>
            </View>
          </TouchableRipple>
        </ScrollView>
        {datePickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={this.changeDate}
            maximumDate={new Date()}
          />
        )}
      </View>
    );
  }
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
