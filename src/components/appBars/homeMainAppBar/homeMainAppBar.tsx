import React from 'react';
import {Appbar, Menu} from 'react-native-paper';
import I18n from '../../../i18n/i18n';
import {DATE, GroupedBy} from '../../../screens/home/home';

type AppBarProps = {
  title: string;
  menuVisible: boolean;
  onSearchButtonPress: () => void;
  onMenuButtonPress: () => void;
  onMenuDismiss: () => void;
  onGroupByPress: () => void;
  onFilterPress: () => void;
  onDropFiltersPress: () => void;
  groupedBy: GroupedBy;
  hasFilter: boolean;
};

export const HomeMainAppBar = (props: AppBarProps) => {
  const {
    title,
    menuVisible,
    onSearchButtonPress,
    onMenuButtonPress,
    onMenuDismiss,
    onGroupByPress,
    onFilterPress,
    onDropFiltersPress,
    groupedBy,
    hasFilter,
  } = props;

  const renderDropFiltersButton = () => {
    if (hasFilter) {
      return (
        <Menu.Item
          title={I18n.t('action_drop_filters')}
          onPress={onDropFiltersPress}
        />
      );
    }
  };

  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action icon="magnify" onPress={onSearchButtonPress} />
      <Menu
        onDismiss={onMenuDismiss}
        visible={menuVisible}
        anchor={
          <Appbar.Action
            color="white"
            icon="dots-vertical"
            onPress={onMenuButtonPress}
          />
        }>
        <Menu.Item
          title={
            groupedBy === DATE
              ? I18n.t('action_group_by_category')
              : I18n.t('action_group_by_date')
          }
          onPress={onGroupByPress}
        />
        <Menu.Item
          title={I18n.t(
            hasFilter ? 'action_change_filters' : 'action_set_filters',
          )}
          onPress={onFilterPress}
        />
        {renderDropFiltersButton()}
      </Menu>
    </Appbar.Header>
  );
};
