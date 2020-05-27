import {Appbar} from 'react-native-paper';
import React from 'react';
import I18n from '../../../i18n/i18n';

type AppBarProps = {
  count: number;
  onDropButtonPress: () => void;
  onEditButtonPress?: () => void;
  onDeleteButtonPress: () => void;
  onConfirmButtonPress?: () => void;
};

export const SelectAppBar = (props: AppBarProps) => {
  const {
    count,
    onDropButtonPress,
    onEditButtonPress,
    onDeleteButtonPress,
    onConfirmButtonPress,
  } = props;
  return (
    <Appbar.Header>
      <Appbar.Action icon="close" onPress={onDropButtonPress} />
      <Appbar.Content title={count + ' ' + I18n.t('label_selected')} />
      {count === 1 && onEditButtonPress ? (
        <Appbar.Action icon="pencil" onPress={onEditButtonPress} />
      ) : null}
      <Appbar.Action icon="delete" onPress={onDeleteButtonPress} />
      {onConfirmButtonPress ? (
        <Appbar.Action icon="check" onPress={onConfirmButtonPress} />
      ) : null}
    </Appbar.Header>
  );
};
