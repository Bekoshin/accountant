import {Appbar} from 'react-native-paper';
import React from 'react';

type AppBarProps = {
  title: string;
  onBackButtonPress: () => void;
  onSaveButtonPress: () => void;
};

export const GeneralAppBar = (props: AppBarProps) => {
  const {title, onBackButtonPress, onSaveButtonPress} = props;
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={onBackButtonPress} />
      <Appbar.Content title={title} />
      <Appbar.Action icon="content-save" onPress={onSaveButtonPress} />
    </Appbar.Header>
  );
};
