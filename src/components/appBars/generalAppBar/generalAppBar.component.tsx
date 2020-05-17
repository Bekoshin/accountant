import {Appbar} from 'react-native-paper';
import React from 'react';

type AppBarProps = {
  title: string;
  onBackButtonPress: () => void;
  onAddButtonPress?: () => void;
  onSaveButtonPress?: () => void;
};

export const GeneralAppBar = (props: AppBarProps) => {
  const {title, onBackButtonPress, onAddButtonPress, onSaveButtonPress} = props;
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={onBackButtonPress} />
      <Appbar.Content title={title} />
      {onAddButtonPress ? (
        <Appbar.Action icon="plus" onPress={onAddButtonPress} />
      ) : null}
      {onSaveButtonPress ? (
        <Appbar.Action icon="content-save" onPress={onSaveButtonPress} />
      ) : null}
    </Appbar.Header>
  );
};
