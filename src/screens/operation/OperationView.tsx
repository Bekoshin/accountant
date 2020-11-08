import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {styles} from './styles';
import I18n from '../../i18n/i18n';
import {Input} from '../../components/input/Input';
import {COLORS} from '../../constants/colors';
import {convertDate} from '../../utils/DateUtils';
import {Button} from '../../components/button/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Category from '../../entities/Category';

type OperationViewProps = {
  amount: string;
  changeAmount: (amount: string) => void;
  amountError: boolean;
  hideAmountError: () => void;

  category: Category | null;
  onCategoryInputPress: () => void;
  categoryError: boolean;
  hideCategoryError: () => void;

  date: Date;
  changeDate: (date: Date) => void;
  dateError: boolean;
  hideDateError: () => void;

  note: string;
  changeNote: (note: string) => void;

  isIgnored: boolean;
  changeIsIgnored: (value: boolean) => void;

  isBySubscription: boolean;
  onSaveButtonPress: () => Promise<void>;
};

export const OperationView = (props: OperationViewProps) => {
  const {
    amount,
    changeAmount,
    amountError,
    hideAmountError,
    category,
    onCategoryInputPress,
    categoryError,
    hideCategoryError,
    date,
    changeDate,
    dateError,
    hideDateError,
    note,
    changeNote,
    isIgnored,
    changeIsIgnored,
    isBySubscription,
    onSaveButtonPress,
  } = props;

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateInputPress = () => {
    hideDateError();
    showDatePicker();
  };

  const handleChangeDate = (newDate: Date) => {
    changeDate(newDate);
    hideDatePicker();
  };

  return (
    <View style={styles.mainContainer}>
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
              placeholder="0 ₽"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_category')}</Text>
            <TouchableHighlight
              style={styles.touchableContainer}
              onPress={onCategoryInputPress}
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
        <Button
          style={styles.saveButton}
          label={I18n.t('action_save')}
          onPress={onSaveButtonPress}
        />
        <DateTimePickerModal
          date={date}
          isVisible={datePickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={handleChangeDate}
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
