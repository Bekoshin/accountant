import React, {SyntheticEvent} from 'react';
import {View, ScrollView, Platform} from 'react-native';

import {Button} from 'react-native-paper';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import Category from '../../../entities/Category';
import styles from './filters.styles';
import DateHandler from '../../../utils/DateHandler';

interface FiltersProps {
  navigation: any;
}

interface FiltersState {
  amountFrom: string;
  amountTo: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  categories: Category[];
}

export default class FiltersScreen extends React.PureComponent<
  FiltersProps,
  FiltersState
> {
  constructor(props: FiltersProps) {
    super(props);
    this.state = {
      amountFrom: '',
      amountTo: '',
      dateFrom: null,
      dateTo: null,
      categories: [],
    };
  }

  static navigationOptions = ({navigation}: any) => {
    let params = navigation.state.params;
    console.log('params: ', params);
    return {
      title: I18n.t('filters_screen'),
      headerRight: () => (
        <Button onPress={() => params.saveButtonHandler()}>
          {I18n.t('action_save')}
        </Button>
      ),
    };
  };

  private handleSaveButton = async () => {};

  private changeAmountFrom = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      this.setState({
        amountFrom: amount,
      });
    }
  };

  private changeAmountTo = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      this.setState({
        amountTo: amount,
      });
    }
  };

  private changeCategories = (categories: Category[]) => {
    this.setState({categories: categories});
  };

  componentDidMount() {
    this.props.navigation.setParams({saveButtonHandler: this.handleSaveButton});
    console.log('FILTERS DID MOUNT');
  }

  componentWillUnmount() {
    console.log('FILTERS WILL UNMOUNT');
  }

  render() {
    const {amountFrom, amountTo, categories, dateFrom, dateTo} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <Input
            label={I18n.t('label_category')}
            value={this.createCategoriesString()}
            editable={false}
            onClearPress={() => this.changeCategories([])}
            onInputPress={() =>
              navigation.navigate('Categories', {
                setCategories: this.changeCategories,
                selectedCategories: categories,
              })
            }
          />
          <View style={styles.rowContainer}>
            <Input
              style={styles.leftInput}
              label={I18n.t('label_amount_from')}
              value={amountFrom}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={this.changeAmountFrom}
            />
            <Input
              style={styles.rightInput}
              label={I18n.t('label_amount_to')}
              value={amountTo}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={this.changeAmountTo}
            />
          </View>
          <View style={styles.rowContainer}>
            <Input
              style={styles.leftInput}
              label={I18n.t('label_date_from')}
              value={DateHandler.convertDate(dateFrom)}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={this.changeAmountFrom}
            />
            <Input
              style={styles.rightInput}
              label={I18n.t('label_date_to')}
              value={DateHandler.convertDate(dateFrom)}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={this.changeAmountTo}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  createCategoriesString() {
    const {categories} = this.state;
    let string = '';
    for (let i = 0; i < categories.length; i++) {
      string += I18n.t(categories[i].name, {defaultValue: categories[i].name});
      if (i !== categories.length - 1) {
        string += ', ';
      }
    }
    return string;
  }
}
