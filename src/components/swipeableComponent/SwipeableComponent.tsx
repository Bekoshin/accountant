import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {styles} from './styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {LineAwesomeIcon} from '../../constants/LineAwesomeIconSet';
import {COLORS} from '../../constants/colors';

type SwipeableComponentProps = {
  onRightButtonPress: () => void;
  disabledSwipe?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const SwipeableComponent: FunctionComponent<SwipeableComponentProps> = (
  props,
) => {
  const {onRightButtonPress, children, disabledSwipe, style} = props;
  const [swipeableRef, setSwipeableRef] = useState<Swipeable | null>(null);

  useEffect(() => {
    if (disabledSwipe && swipeableRef) {
      swipeableRef.close();
    }
  }, [disabledSwipe, swipeableRef]);

  const handleDeleteButton = () => {
    if (swipeableRef) {
      swipeableRef.close();
    }
    onRightButtonPress();
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.rightAction, style]}>
        <TouchableOpacity onPress={handleDeleteButton}>
          <LineAwesomeIcon
            name={'trash'}
            size={22}
            color={COLORS.SECONDARY_DARK_1}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      enabled={!disabledSwipe}
      childrenContainerStyle={[styles.swipeableContainer, style]}
      useNativeAnimations={true}
      ref={setSwipeableRef}
      friction={2}
      leftThreshold={20}
      overshootRight={false}
      rightThreshold={30}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};
