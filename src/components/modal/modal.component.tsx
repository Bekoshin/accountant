import * as React from 'react';
import Modal from 'react-native-modal';
import styles from './styles';

interface ModalProps {
  style?: any;
  isVisible: boolean;
  close: () => void;
  scrollTo?: (position: any) => void;
  scrollOffset?: number;
}

export default class ModalComponent extends React.PureComponent<ModalProps> {
  render() {
    const {
      style,
      isVisible,
      children,
      close,
      scrollTo,
      scrollOffset,
    } = this.props;
    return (
      <Modal
        style={[styles.modal, style]}
        isVisible={isVisible}
        onSwipeComplete={close}
        swipeDirection={['down']}
        onBackdropPress={close}
        scrollTo={scrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={400 - 300} // content height - ScrollView height
        /*fix issue with closing modal*/
        backdropTransitionOutTiming={0}>
        {children}
      </Modal>
    );
  }
}
