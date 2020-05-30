import React from 'react';
import {Button, Surface} from 'react-native-paper';

type RewindButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export const RewindButton = (props: RewindButtonProps) => {
  const {visible, onPress} = props;
  if (visible) {
    return (
      <Surface
        style={{
          position: 'absolute',
          right: 16,
          top: 32,
          borderRadius: 100,
          width: 36,
          height: 36,
        }}>
        <Button
          style={{
            padding: 0,
            borderRadius: 100,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
          }}
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
