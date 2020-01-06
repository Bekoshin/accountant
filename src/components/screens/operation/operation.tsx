import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import {Button, TouchableRipple} from 'react-native-paper';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import Category from '../../../entities/Category';

interface OperationProps {
  navigation: any;

  operation?: Operation;
}

interface OperationState {
  amount: number;
  category: Category | null;

  amountError: string;
  categoryError: string;
}

class OperationScreen extends React.PureComponent<
  OperationProps,
  OperationState
> {
  state = {
    amount: this.props.operation ? this.props.operation.amount : 0,
    category: this.props.operation ? this.props.operation.category : null,
    amountError: '',
    categoryError: '',
  };

  static navigationOptions = {
    title: 'Операция',
    headerRight: () => <Button onPress={() => {}}>Сохранить</Button>,
  };

  hideAmountError = () => {
    this.setState({amountError: ''});
  };

  showAmountError = () => {
    this.setState({amountError: I18n.t('label_required')});
  };

  hideCategoryError = () => {
    this.setState({categoryError: ''});
  };

  showCategoryError = () => {
    this.setState({categoryError: I18n.t('label_required')});
  };

  changeAmount = (amount: string) => {
    this.setState({amount: parseFloat(amount)});
  };

  changeCategory = (category: Category | null) => {
    this.setState({category: category});
  };

  componentDidMount(): void {
    console.log('OPERATION DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('OPERATION WILL UNMOUNT');
  }

  render() {
    const {amount, category, amountError, categoryError} = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
        <ScrollView>
          <Input
            label={I18n.t('label_amount')}
            value={amount.toString()}
            required={true}
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
            errorMessage={categoryError}
            onInputPress={() =>
              this.props.navigation.navigate('Categories', {
                selectCategory: this.changeCategory,
              })
            }
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(OperationScreen);
