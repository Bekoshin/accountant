import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, TouchableHighlight} from 'react-native';
import {Input} from '../../components/input/Input';
import I18n from '../../i18n/i18n';
import styles from './styles';
import {convertDate} from '../../utils/DateUtils';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AppState} from '../../store/store';
import {connect} from 'react-redux';
import {Filter} from '../../entities/Filter';
import {applyFilter} from '../../utils/FilterUtils';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {GeneralAppBar} from '../../components/appBars/generalAppBar/generalAppBar';
import {COLORS} from '../../constants/colors';

type FiltersScreenProps = {
  route: RouteProp<RootStackParamList, 'Filters'>;
  navigation: StackNavigationProp<RootStackParamList, 'Filters'>;

  filter: Filter | null;
  applyFilter: (filter: Filter | null) => void;
};

const FiltersScreen = (props: FiltersScreenProps) => {
  const {navigation, route, filter} = props;
  const {selectedCategories} = route.params;

  const [categories, setCategories] = useState(filter ? filter.categories : []);
  const [dateFrom, setDateFrom] = useState(
    filter ? filter.dateFrom : undefined,
  );
  const [dateTo, setDateTo] = useState(filter ? filter.dateTo : undefined);
  const [amountFrom, setAmountFrom] = useState(
    filter ? (filter.amountFrom ? filter.amountFrom.toString() : '') : '',
  );
  const [amountTo, setAmountTo] = useState(
    filter ? (filter.amountTo ? filter.amountTo.toString() : '') : '',
  );
  const [note, setNote] = useState(filter ? filter.note : '');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isDateFromInputPressed, setIsDateFromInputPressed] = useState(false);
  const [isDateToInputPressed, setIsDateToInputPressed] = useState(false);

  useEffect(() => {
    if (selectedCategories) {
      setCategories(selectedCategories);
    }
  }, [selectedCategories]);

  const clearAllCategories = () => {
    setCategories([]);
  };

  const clearDateFrom = () => {
    setDateFrom(undefined);
  };

  const clearDateTo = () => {
    setDateTo(undefined);
  };

  const handleSaveButton = () => {
    let newFilter: Filter | null = null;
    if (isFilterNotEmpty()) {
      newFilter = new Filter(
        amountFrom ? parseFloat(amountFrom) : undefined,
        amountTo ? parseFloat(amountTo) : undefined,
        categories,
        dateFrom,
        dateTo,
        note,
        undefined,
      );
    }
    if (newFilter !== filter) {
      props.applyFilter(newFilter);
    }
    navigation.goBack();
  };

  const isFilterNotEmpty = () => {
    return (
      amountFrom ||
      amountTo ||
      dateFrom ||
      dateTo ||
      categories.length > 0 ||
      note
    );
  };

  const handleDateFromInputPress = () => {
    setIsDateFromInputPressed(true);
    setDatePickerVisible(true);
  };

  const handleDateToInputPress = () => {
    setIsDateToInputPressed(true);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setIsDateFromInputPressed(false);
    setIsDateToInputPressed(false);
  };

  const changeAmountFrom = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      setAmountFrom(amount);
    }
  };

  const changeAmountTo = (amount: string) => {
    if (amount.match(/^\d*\.?\d*$/)) {
      setAmountTo(amount);
    }
  };

  const changeDate = (date: Date) => {
    if (isDateFromInputPressed) {
      setDateFrom(date);
      setIsDateFromInputPressed(false);
    } else if (isDateToInputPressed) {
      setDateTo(date);
      setIsDateToInputPressed(false);
    }
    setDatePickerVisible(false);
  };

  const createCategoriesString = () => {
    let string = '';
    for (let i = 0; i < categories.length; i++) {
      string += I18n.t(categories[i].name, {defaultValue: categories[i].name});
      if (i !== categories.length - 1) {
        string += ', ';
      }
    }
    return string;
  };

  const handleCategoryInputPress = () => {
    navigation.navigate('Categories', {
      selectedCategories: categories,
      previousScreen: 'Filters',
    });
  };

  return (
    <View style={styles.mainContainer}>
      <GeneralAppBar
        onBackButtonPress={navigation.goBack}
        onSaveButtonPress={handleSaveButton}
        title={I18n.t('filters_screen')}
      />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{I18n.t('label_category')}</Text>
          <TouchableHighlight
            style={styles.touchableContainer}
            onPress={handleCategoryInputPress}
            activeOpacity={0.9}
            underlayColor={COLORS.PRIMARY_DARK}>
            <Input
              value={createCategoriesString()}
              editable={false}
              onClearButtonPress={clearAllCategories}
              onChangeText={() => {}}
              pointerEvents="none"
              placeholder={I18n.t('placeholder_select_categories')}
              multiline={true}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.leftInputContainer}>
            <Text style={styles.label}>{I18n.t('label_amount_from')}</Text>
            <Input
              value={amountFrom}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={changeAmountFrom}
            />
          </View>
          <View style={styles.rightInputContainer}>
            <Text style={styles.label}>{I18n.t('label_amount_to')}</Text>
            <Input
              value={amountTo}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={changeAmountTo}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.leftInputContainer}>
            <Text style={styles.label}>{I18n.t('label_date_from')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={handleDateFromInputPress}
              activeOpacity={0.9}
              underlayColor={COLORS.PRIMARY_DARK}>
              <Input
                editable={false}
                value={convertDate(dateFrom)}
                onClearButtonPress={clearDateFrom}
                onChangeText={() => {}}
                pointerEvents="none"
              />
            </TouchableHighlight>
          </View>
          <View style={styles.rightInputContainer}>
            <Text style={styles.label}>{I18n.t('label_date_to')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={handleDateToInputPress}
              activeOpacity={0.9}
              underlayColor={COLORS.PRIMARY_DARK}>
              <Input
                editable={false}
                value={convertDate(dateTo)}
                onClearButtonPress={clearDateTo}
                onChangeText={() => {}}
                pointerEvents="none"
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{I18n.t('label_note')}</Text>
          <Input
            value={note}
            onChangeText={setNote}
            multiline={true}
            placeholder={I18n.t('placeholder_write_note')}
          />
        </View>
      </ScrollView>
      <DateTimePickerModal
        date={isDateFromInputPressed ? dateFrom : dateTo}
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

const mapStateToProps = (state: AppState) => ({
  filter: state.homeReducer.filter,
});

const mapDispatchToProps = {
  applyFilter,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FiltersScreen);
