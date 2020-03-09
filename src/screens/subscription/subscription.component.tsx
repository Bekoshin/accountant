import React from 'react';
import {View, ScrollView} from 'react-native';
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
import {Appbar} from 'react-native-paper';

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

  private changeName = (name: string) => {
    this.setState({name: name});
  };

  private changeValue = (value: string) => {
    if (value.match(/^\d*\.?\d*$/)) {
      this.setState({
        value: value,
      });
    }
  };

  private changeCategory = (category: Category | null) => {
    this.setState({category: category});
  };

  private changeDay = (day: string) => {
    this.setState({day: day});
  };

  private changeNote = (note: string) => {
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
      name,
      value,
      category,
      day,
      note,
      nameError,
      valueError,
      categoryError,
      dayError,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        {this.renderAppBar()}
        <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
          <ScrollView>
            <Input
              label={I18n.t('label_name')}
              value={name}
              required={true}
              errorMessage={nameError}
              onFocus={this.hideNameError}
              onChangeText={this.changeName}
            />
            <Input
              label={I18n.t('label_value')}
              value={value}
              keyboardType="numeric"
              required={true}
              selectTextOnFocus={true}
              errorMessage={valueError}
              onFocus={this.hideValueError}
              onChangeText={this.changeValue}
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
              label={I18n.t('label_day')}
              value={day}
              keyboardType="numeric"
              required={true}
              selectTextOnFocus={true}
              errorMessage={dayError}
              onFocus={this.hideDayError}
              onChangeText={this.changeDay}
            />
            <Input
              label={I18n.t('label_note')}
              value={note}
              onChangeText={this.changeNote}
              multiline={true}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  renderAppBar() {
    const {navigation} = this.props;
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={I18n.t(
            this.subscription
              ? 'subscription_screen'
              : 'new_subscription_screen',
          )}
        />
        <Appbar.Action
          icon="content-save"
          onPress={(() => this.handleSaveButton()) as () => void}
        />
      </Appbar.Header>
    );
  }
}

const saveSubscription = (
  subscription: Subscription,
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  let storageHandler = new StorageHandler();
  await storageHandler.initSubscriptionRepo();
  await storageHandler.saveSubscription(subscription);
  const subscriptions = await storageHandler.getAllSubscriptions();
  dispatch({
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
  },
)(SubscriptionScreen);
