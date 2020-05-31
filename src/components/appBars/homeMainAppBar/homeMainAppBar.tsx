import React, {useEffect, useState} from 'react';
import {Appbar, Menu, Searchbar} from 'react-native-paper';
import I18n from '../../../i18n/i18n';
import {DATE, GroupedBy} from '../../../screens/home/home';
import {Animated, Dimensions} from 'react-native';

type AppBarProps = {
  title: string;
  menuVisible: boolean;
  groupedBy: GroupedBy;
  hasFilter: boolean;
  searchMode: boolean;
  searchValue: string;
  onSearchButtonPress: () => void;
  onMenuButtonPress: () => void;
  onMenuDismiss: () => void;
  onGroupByPress: () => void;
  onFilterPress: () => void;
  onDropFiltersPress: () => void;
  onHideSearchBarButtonPress: () => void;
  onSearchValueChange: (text: string) => void;
};

const {width} = Dimensions.get('window');

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
    onHideSearchBarButtonPress,
    groupedBy,
    hasFilter,
    searchMode,
    searchValue,
    onSearchValueChange,
  } = props;

  const [animatedSearchMode] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedSearchMode, {
      toValue: searchMode ? 1 : 0,
      duration: 200,
    }).start();
  }, [animatedSearchMode, searchMode]);

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

  const searchStyle = {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: animatedSearchMode.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, 6],
    }),
    left: animatedSearchMode.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 6],
    }),
  };

  const mainStyle = {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: animatedSearchMode.interpolate({
      inputRange: [0, 1],
      outputRange: [6, -width],
    }),
    right: animatedSearchMode.interpolate({
      inputRange: [0, 1],
      outputRange: [6, width],
    }),
  };

  return (
    <Appbar.Header>
      <Animated.View style={mainStyle}>
        <Appbar.Content title={title} />
        <Appbar.Action
          icon="magnify"
          color="white"
          onPress={onSearchButtonPress}
        />
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
      </Animated.View>
      {/*)}*/}
      <Animated.View style={searchStyle}>
        <Appbar.Action
          icon="arrow-left"
          color="white"
          onPress={onHideSearchBarButtonPress}
        />
        <Searchbar
          style={{flex: 1, height: 40}}
          placeholder="Search"
          onChangeText={onSearchValueChange}
          value={searchValue}
        />
      </Animated.View>
    </Appbar.Header>
  );
};
