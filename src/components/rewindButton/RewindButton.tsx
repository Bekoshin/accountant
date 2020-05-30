import React from 'react';
import {Button, Surface} from 'react-native-paper';
import styles from './styles';

type RewindButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export const RewindButton = (props: RewindButtonProps) => {
  const {visible, onPress} = props;
  if (visible) {
    return (
      <Surface style={styles.mainContainer}>
        <Button
          style={styles.buttonStyle}
          mode="contained"
          icon="skip-forward"
          onPress={onPress}
          compact={true}>
          {}
        </Button>
      </Surface>
    );
  }
  return null;
};
