import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {styles} from './styles';
import I18n from '../../i18n/i18n';
import {Input} from '../../components/input/Input';
import {COLORS} from '../../constants/colors';
import {Button} from '../../components/button/Button';
import Category from '../../entities/Category';

type SubscriptionViewProps = {
  name: string;
  changeName: (name: string) => void;
  nameError: boolean;
  hideNameError: () => void;

  amount: string;
  changeAmount: (amount: string) => void;
  amountError: boolean;
  hideAmountError: () => void;

  category: Category | null;
  onCategoryInputPress: () => void;
  categoryError: boolean;
  hideCategoryError: () => void;

  day: string;
  changeDay: (day: string) => void;
  dayError: boolean;
  hideDayError: () => void;

  note: string;
  changeNote: (note: string) => void;

  onSaveButtonPress: () => Promise<void>;
};

export const SubscriptionView = (props: SubscriptionViewProps) => {
  const {
    name,
    changeName,
    nameError,
    hideNameError,
    amount,
    changeAmount,
    amountError,
    hideAmountError,
    category,
    onCategoryInputPress,
    categoryError,
    hideCategoryError,
    day,
    changeDay,
    dayError,
    hideDayError,
    note,
    changeNote,
    onSaveButtonPress,
  } = props;

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{I18n.t('label_name')}</Text>
            <Input
              value={name}
              error={nameError}
              onFocus={hideNameError}
              onChangeText={changeName}
              placeholder={I18n.t('placeholder_write_name')}
            />
          </View>
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
            <Text style={styles.label}>{I18n.t('label_day')}</Text>
            <Input
              value={day}
              keyboardType="numeric"
              selectTextOnFocus={true}
              error={dayError}
              onFocus={hideDayError}
              onChangeText={changeDay}
              placeholder={I18n.t('placeholder_write_day')}
            />
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
        </ScrollView>
        <Button
          style={styles.saveButton}
          label={I18n.t('action_save')}
          onPress={onSaveButtonPress}
        />
      </SafeAreaView>
    </View>
  );
};
