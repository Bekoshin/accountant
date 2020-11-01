import React, {FunctionComponent} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';
import {styles} from './styles';

type MssModalProps = {
  scrollTo: (p: {animated?: boolean; offset: number}) => void;
  scrollOffset: number | undefined;
  visible: boolean;
  onSwipeComplete: () => void;
  onBackdropPress?: () => void;
  onModalShow?: () => void;
  onModalHide?: () => void;
  onModalWillHide?: () => void;
  style?: StyleProp<ViewStyle>;
  avoidKeyboard?: boolean;
};

export const BaseModal: FunctionComponent<MssModalProps> = (props) => {
  const {
    visible,
    onSwipeComplete,
    onBackdropPress,
    children,
    scrollTo,
    scrollOffset,
    style,
    avoidKeyboard,
    onModalShow,
    onModalHide,
    onModalWillHide,
  } = props;

  return (
    <Modal
      style={styles.modal}
      avoidKeyboard={avoidKeyboard}
      testID={'modal'}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackdropPress}
      isVisible={visible}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={['down']}
      scrollTo={scrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={400 - 300} // content height - ScrollView height
      propagateSwipe={true}
      onModalShow={onModalShow}
      onModalHide={onModalHide}
      onModalWillHide={onModalWillHide}>
      <View style={[styles.scrollableModal, style]}>
        <View style={styles.headerView} />
        {children}
      </View>
    </Modal>
  );
};
