import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Divider, List} from 'react-native-paper';
import I18n from '../../i18n/i18n';
import {styles} from './styles';

type SettingsViewProps = {
  canRestoreDefaultCategories: boolean;
  canWipeData: boolean;
  onCategoryManagementPress: () => void;
  onSubscriptionManagementPress: () => void;
  onRestoreDefaultCategoriesPress: () => Promise<void>;
  onWipeDataPress: () => Promise<void>;
};

export const SettingsView = (props: SettingsViewProps) => {
  const {
    canRestoreDefaultCategories,
    canWipeData,
    onCategoryManagementPress,
    onSubscriptionManagementPress,
    onRestoreDefaultCategoriesPress,
    onWipeDataPress,
  } = props;

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView>
          <List.Item
            title={I18n.t('label_category_management')}
            onPress={onCategoryManagementPress}
          />
          <Divider />
          <List.Item
            title={I18n.t('label_subscription_management')}
            onPress={onSubscriptionManagementPress}
          />
          <Divider />
          <List.Item
            titleStyle={{
              color: canRestoreDefaultCategories ? undefined : 'gray',
            }}
            disabled={!canRestoreDefaultCategories}
            title={I18n.t('label_restore_default_categories')}
            onPress={onRestoreDefaultCategoriesPress}
          />
          <Divider />
          <List.Item
            titleStyle={{color: canWipeData ? undefined : 'gray'}}
            disabled={!canWipeData}
            title={I18n.t('label_wipe_all_data')}
            onPress={onWipeDataPress}
          />
          <Divider />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
