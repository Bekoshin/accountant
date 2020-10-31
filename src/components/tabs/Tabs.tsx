import React from 'react';
import {
  StyleProp,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import {COLORS} from '../../constants/colors';
import {PickerItem} from '../../entities/PickerItem';

type TabsProps = {
  tabs: PickerItem[];
  selectedTab: PickerItem;
  onTabPress: (tab: PickerItem) => void;
  style?: StyleProp<ViewStyle>;
};

export const Tabs = (props: TabsProps) => {
  const {tabs, selectedTab, onTabPress, style} = props;

  const renderTabs = () => {
    return tabs.map((item, index) => {
      let textColor;
      let backgroundColor;
      let borderHorizontalWidth;
      let borderLeftWidth;
      let borderRightWidth;
      let borderRadiusLeft;
      let borderRadiusRight;
      let borderColor;
      let disabled = false;

      if (item.id === selectedTab.id) {
        textColor = COLORS.PRIMARY;
        backgroundColor = COLORS.BACKGROUND_1;
        borderLeftWidth = 1;
        borderRightWidth = 1;
        borderHorizontalWidth = 1;
        borderColor = backgroundColor;
        disabled = true;
      } else {
        textColor = COLORS.PRIMARY_DARK;
        borderHorizontalWidth = 1;
        borderColor = COLORS.OUTLINE;
        if (index === 0) {
          borderLeftWidth = 1;
        } else if (index === tabs.length - 1) {
          borderRightWidth = 1;
        }
      }

      if (index === 0) {
        borderRadiusLeft = 4;
      } else if (index === tabs.length - 1) {
        borderRadiusRight = 4;
      }

      return (
        <TouchableHighlight
          key={index}
          style={[
            styles.tabContainer,
            {
              borderBottomWidth: borderHorizontalWidth,
              borderTopWidth: borderHorizontalWidth,
              borderLeftWidth: borderLeftWidth,
              borderRightWidth: borderRightWidth,
              borderBottomLeftRadius: borderRadiusLeft,
              borderTopLeftRadius: borderRadiusLeft,
              borderBottomRightRadius: borderRadiusRight,
              borderTopRightRadius: borderRadiusRight,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
          ]}
          onPress={() => onTabPress(item)}
          disabled={disabled}
          activeOpacity={0.9}
          underlayColor={COLORS.OUTLINE}>
          <Text style={[styles.text, {color: textColor}]}>{item.name}</Text>
        </TouchableHighlight>
      );
    });
  };

  return <View style={[styles.mainContainer, style]}>{renderTabs()}</View>;
};
