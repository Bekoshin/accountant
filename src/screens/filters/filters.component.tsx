import React from 'react';
import {View, ScrollView} from 'react-native';

import {Appbar} from 'react-native-paper';
import Input from '../../components/input/input';
import I18n from '../../i18n/i18n';
import Category from '../../entities/Category';
import styles from './filters.styles';
import DateHandler from '../../utils/DateHandler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import {Filter} from '../../entities/Filter';
import {applyFilter} from '../../utils/FilterUtils';

interface FiltersProps {
  navigation: any;

  filter: Filter | null;

  applyFilter: (filter: Filter | null) => void;
}

interface FiltersState {
  amountFrom: string;
  amountTo: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  categories: Category[];
  note: string;
  datePickerVisible: boolean;
  isDateFromInputPressed: boolean;
  isDateToInputPressed: boolean;
}

class FiltersScreen extends React.PureComponent<FiltersProps, FiltersState> {
  constructor(props: FiltersProps) {
    super(props);
    const {filter} = props;
    if (filter) {
      this.state = {
        amountFrom: filter.amountFrom ? filter.amountFrom.toString() : '',
        amountTo: filter.amountTo ? filter.amountTo.toString() : '',
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
        categories: filter.categories,
        note: filter.note,
        datePickerVisible: false,
        isDateFromInputPressed: false,
        isDateToInputPressed: false,
      };
    } else {
      this.state = {
        amountFrom: '',
        amountTo: '',
        dateFrom: undefined,
        dateTo: undefined,
        categories: [],
        note: '',
        datePickerVisible: false,
        isDateFromInputPressed: false,
        isDateToInputPressed: false,
      };
    }
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  private handleApplyButton = async () => {
    const {
      amountFrom,
      amountTo,
      dateFrom,
      dateTo,
      categories,
      note,
    } = this.state;
    let filter: Filter | null = null;
    if (this.isFilterNotEmpty()) {
      filter = new Filter(
        amountFrom ? parseFloat(amountFrom) : undefined,
        amountTo ? parseFloat(amountTo) : undefined,
        categories,
        dateFrom,
        dateTo,
        note,
      );
    }
    if (this.props.filter !== filter) {
      this.props.applyFilter(filter);
    }
    await this.props.navigation.goBack();
  };

  isFilterNotEmpty = () => {
    const {
      amountFrom,
      amountTo,
      dateFrom,
      dateTo,
      categories,
      note,
    } = this.state;
    return (
      amountFrom ||
      amountTo ||
      dateFrom ||
      dateTo ||
      categories.length > 0 ||
      note
    );
  };

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

  private changeNote = (note: string) => {
    this.setState({note: note});
  };

  private changeDate = (date: Date) => {
    const {isDateFromInputPressed, isDateToInputPressed} = this.state;
    if (isDateFromInputPressed) {
      this.changeDateFrom(date);
    } else if (isDateToInputPressed) {
      this.changeDateTo(date);
    }
  };

  private changeDateFrom = (date: Date | undefined) => {
    this.setState({
      isDateFromInputPressed: false,
      datePickerVisible: false,
      dateFrom: date,
    });
  };

  private changeDateTo = (date: Date | undefined) => {
    this.setState({
      isDateToInputPressed: false,
      datePickerVisible: false,
      dateTo: date,
    });
  };

  handleDateFromInputPress = () => {
    this.setState({isDateFromInputPressed: true, datePickerVisible: true});
  };

  handleDateToInputPress = () => {
    this.setState({isDateToInputPressed: true, datePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({
      datePickerVisible: false,
      isDateFromInputPressed: false,
      isDateToInputPressed: false,
    });
  };

  componentDidMount() {
    console.log('FILTERS DID MOUNT');
  }

  componentWillUnmount() {
    console.log('FILTERS WILL UNMOUNT');
  }

  render() {
    const {
      amountFrom,
      amountTo,
      categories,
      dateFrom,
      dateTo,
      note,
      datePickerVisible,
      isDateFromInputPressed,
    } = this.state;
    const {navigation} = this.props;
    return (
      <View style={{flex: 1}}>
        {this.renderAppBar()}
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
                editable={false}
                value={DateHandler.convertDate(dateFrom)}
                onClearPress={() => this.changeDateFrom(undefined)}
                onInputPress={this.handleDateFromInputPress}
              />
              <Input
                style={styles.rightInput}
                label={I18n.t('label_date_to')}
                editable={false}
                value={DateHandler.convertDate(dateTo)}
                onClearPress={() => this.changeDateTo(undefined)}
                onInputPress={this.handleDateToInputPress}
              />
            </View>
            <Input
              label={I18n.t('label_note')}
              value={note}
              onChangeText={this.changeNote}
              multiline={true}
            />
          </ScrollView>
          <DateTimePickerModal
            date={isDateFromInputPressed ? dateFrom : dateTo}
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
      </View>
    );
  }

  renderAppBar() {
    const {navigation} = this.props;
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={I18n.t('filters_screen')} />
        <Appbar.Action
          icon="content-save"
          onPress={() => this.handleApplyButton()}
        />
      </Appbar.Header>
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

const mapStateToProps = (state: AppState) => ({
  filter: state.homeReducer.filter,
});

export default connect(
  mapStateToProps,
  {
    applyFilter: (filter: Filter | null) => applyFilter(filter),
  },
)(FiltersScreen);
