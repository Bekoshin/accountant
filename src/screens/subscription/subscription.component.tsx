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
import Subscription from '../../entities/Subscription';

interface SubscriptionProps {
  navigation: any;

  saveSubscription: (subscription: Subscription) => void;
}

interface SubscriptionState {
  name: string;
  value: string;
  category: Category | null;
  day: string;
  note: string;

  nameError: string;
  valueError: string;
  categoryError: string;
  dayError: string;
}

class SubscriptionScreen extends React.PureComponent<
  SubscriptionProps,
  SubscriptionState
> {
  private readonly subscription: Subscription | undefined = undefined;

  constructor(props: SubscriptionProps) {
    super(props);
    this.subscription = props.navigation.getParam('subscription');
    this.state = {
      name: this.subscription ? this.subscription.name : '',
      value: this.subscription ? this.subscription.value.toString() : '',
      category: this.subscription ? this.subscription.category : null,
      day: this.subscription ? this.subscription.day.toString() : '',
      note: this.subscription ? this.subscription.note : '',
      nameError: '',
      valueError: '',
      categoryError: '',
      dayError: '',
    };
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  private handleSaveButton = async () => {
    console.log('HANDLE SAVE BUTTON');
    const {name, value, category, day, note} = this.state;
    if (this.checkFields()) {
      try {
        let subscription: Subscription;
        subscription = new Subscription(
          name,
          category as Category,
          parseFloat(value),
          parseInt(day, 10),
          note,
          this.subscription ? this.subscription.id : undefined,
        );
        await this.props.saveSubscription(subscription);
        await this.props.navigation.goBack();
      } catch (error) {
        console.error('HANDLE SAVE BUTTON. ERROR: ', error);
      }
    }
  };

  private checkFields = () => {
    const {name, value, category, day} = this.state;
    let allFieldsFilled = true;
    if (!name) {
      allFieldsFilled = false;
      this.showNameError();
    }
    if (!value || value === '0') {
      allFieldsFilled = false;
      this.showValueError();
    }
    if (!category) {
      allFieldsFilled = false;
      this.showCategoryError();
    }
    if (!day) {
      allFieldsFilled = false;
      this.showDayError();
    }
    return allFieldsFilled;
  };

  private hideNameError = () => {
    this.setState({nameError: ''});
  };

  private showNameError = () => {
    this.setState({nameError: 'label_required'});
  };

  private hideValueError = () => {
    this.setState({valueError: ''});
  };

  private showValueError = () => {
    this.setState({valueError: I18n.t('label_required')});
  };

  private hideCategoryError = () => {
    this.setState({categoryError: ''});
  };

  private showCategoryError = () => {
    this.setState({categoryError: I18n.t('label_required')});
  };

  private hideDayError = () => {
    this.setState({dayError: ''});
  };

  private showDayError = () => {
    this.setState({dayError: I18n.t('label_required')});
  };

  private changeValue = (value: string) => {
    if (value.match(/^\d*\.?\d*$/)) {
      this.setState({
        value: value,
      });
    }
  };

  changeCategory = (category: Category | null) => {
    this.setState({category: category});
  };

  changeDay = (day: string) => {
    this.setState({day: day});
  };

  changeNote = (note: string) => {
    this.setState({note: note});
  };

  componentDidMount() {
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
