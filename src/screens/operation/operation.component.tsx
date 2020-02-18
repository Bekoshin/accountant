import React, {SyntheticEvent} from 'react';
import {View, ScrollView, Platform, Text} from 'react-native';
import {connect} from 'react-redux';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AppState} from '../../store/store';
import Operation from '../../entities/Operation';
import {Button, Checkbox, TouchableRipple} from 'react-native-paper';
import Input from '../../components/input/input';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import StorageHandler from '../../storage/StorageHandler';
import {ACTION_TYPES} from '../../store/ACTION_TYPES';
import DateHandler from '../../utils/DateHandler';

interface OperationProps {
  navigation: any;

  saveOperation: (operation: Operation) => void;
}

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

class OperationScreen extends React.PureComponent<
  OperationProps,
  OperationState
> {
  private readonly operation: Operation | undefined = undefined;

  constructor(props: OperationProps) {
    super(props);
    this.operation = props.navigation.getParam('operation');
    this.state = {
      amount: this.operation ? this.operation.amount.toString() : '0',
      category: this.operation ? this.operation.category : null,
      timestamp: this.operation ? this.operation.date : new Date(),
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
    const {amount, category, timestamp, note, isIgnored} = this.state;
    if (this.checkFields()) {
      try {
        let operation: Operation;
        operation = new Operation(
          parseFloat(amount),
          category as Category,
          +timestamp,
          note,
          isIgnored,
          undefined,
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
    if (!this.state.timestamp) {
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

  changeDate = (date: Date) => {
    this.setState({
      datePickerVisible: false,
      timestamp: date,
    });
  };

  changeNote = (note: string) => {
    this.setState({note: note});
  };

  changeIsIgnored = () => {
    this.setState({isIgnored: !this.state.isIgnored});
  };

  handleDateInputPress = () => {
    this.hideDateError();
    this.setState({datePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({datePickerVisible: false});
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
      timestamp,
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
            value={DateHandler.convertDate(this.state.timestamp)}
            required={true}
            editable={false}
            errorMessage={dateError}
            onFocus={this.hideDateError}
            hideClearButton={true}
            onInputPress={this.handleDateInputPress}
          />
          <Input
            label={I18n.t('label_note')}
            value={note}
            onChangeText={this.changeNote}
            multiline={true}
          />
          <TouchableRipple onPress={this.changeIsIgnored}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Checkbox status={isIgnored ? 'checked' : 'unchecked'} />
              <Text>{I18n.t('label_ignore')}</Text>
            </View>
          </TouchableRipple>
        </ScrollView>
        <DateTimePickerModal
          date={timestamp}
          isVisible={datePickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={this.changeDate}
          onCancel={this.hideDatePicker}
          headerTextIOS={I18n.t('label_choose_date')}
          cancelTextIOS={I18n.t('action_cancel')}
          confirmTextIOS={I18n.t('action_confirm')}
          locale={I18n.t('locale')}
        />
      </View>
    );
  }
}

const saveOperation = (
  operation: Operation,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.initOperationRepo();
  await storageHandler.saveOperationInRepo(operation);
  const operations = await storageHandler.getAllOperationsFromRepo();
  dispatch({
    type: ACTION_TYPES.OPERATIONS_LOADED,
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
