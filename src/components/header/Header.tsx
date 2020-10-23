import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {LineAwesomeIcon} from '../../constants/LineAwesomeIconSet';
import {COLORS} from '../../constants/colors';
import {SearchBar} from '../searchBar/SearchBar';

type HeaderProps = {
  searchMode?: boolean;
  title?: string;
  onBackButtonPress?: () => void;
  searchQuery?: string;
  searchButton?: boolean;
  changeSearchQuery?: (text: string) => void;
  showSearchBar?: () => void;
  hideSearchBar?: () => void;
  clearSearchQuery?: () => void;
  onDropdownMenuPress?: () => void;
  dropDownMenuVisible?: boolean;
  dropdownMenuLabel?: string;
  photoMode?: boolean;
  selectedPhotosCount?: number;
  unselectAllPhotos?: () => void;
};

export const Header: FunctionComponent<HeaderProps> = props => {
  const {
    children,
    onBackButtonPress,
    title,
    searchMode,
    searchQuery,
    searchButton,
    changeSearchQuery,
    showSearchBar,
    hideSearchBar,
    clearSearchQuery,
    onDropdownMenuPress,
    dropDownMenuVisible,
    dropdownMenuLabel,
    photoMode,
    selectedPhotosCount,
    unselectAllPhotos,
  } = props;

  const renderBackButton = () => {
    if (photoMode && selectedPhotosCount) {
      return (
        <TouchableOpacity style={styles.backButton} onPress={unselectAllPhotos}>
          <LineAwesomeIcon
            name="close"
            size={22}
            color={COLORS.SECONDARY_DARK_1}
          />
        </TouchableOpacity>
      );
    } else {
      if (onBackButtonPress) {
        return (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackButtonPress}>
            <LineAwesomeIcon
              name="angle-left"
              size={22}
              color={COLORS.SECONDARY_DARK_1}
            />
          </TouchableOpacity>
        );
      }
    }
  };

  const renderDropdownMenuHeader = () => {
    if (
      onDropdownMenuPress &&
      dropdownMenuLabel &&
      dropDownMenuVisible !== undefined
    ) {
      return (
        <TouchableOpacity
          style={styles.dropDownMenuHeader}
          onPress={onDropdownMenuPress}>
          <Text style={styles.dropDownMenuLabel}>{dropdownMenuLabel}</Text>
          <LineAwesomeIcon
            name="angle-down"
            size={16}
            color={
              dropDownMenuVisible ? COLORS.PRIMARY : COLORS.SECONDARY_DARK_1
            }
          />
        </TouchableOpacity>
      );
    }
  };

  const renderTitle = () => {
    if (photoMode && selectedPhotosCount) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {'Выбрано ' + selectedPhotosCount}
          </Text>
        </View>
      );
    }
    if (title) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      );
    }
  };

  const renderSearchButton = () => {
    if (searchButton && !searchMode) {
      return (
        <TouchableOpacity onPress={showSearchBar}>
          <LineAwesomeIcon
            name="search"
            size={22}
            color={COLORS.SECONDARY_DARK_1}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {!searchMode ? (
          <View style={styles.leftContainer}>
            <View style={styles.rowContainer}>
              {renderBackButton()}
              {renderDropdownMenuHeader()}
              {renderTitle()}
            </View>
            {renderSearchButton()}
          </View>
        ) : (
          <SearchBar
            style={styles.searchBar}
            value={searchQuery ? searchQuery : ''}
            onChangeText={changeSearchQuery ? changeSearchQuery : () => {}}
            autoFocus={true}
            onClearButtonPress={() => {
              if (searchQuery === '') {
                if (hideSearchBar) {
                  hideSearchBar();
                }
              } else {
                if (clearSearchQuery) {
                  clearSearchQuery();
                }
              }
            }}
            inAppBar={true}
          />
        )}
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </View>
  );
};
