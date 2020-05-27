import {Appbar} from 'react-native-paper';
import React from 'react';
import I18n from '../../../i18n/i18n';

type AppBarProps = {
  title: string;
  selectedCount?: number;
  forceSelectMode?: boolean;
  onBackButtonPress: () => void;
  onAddButtonPress?: () => void;
  onSaveButtonPress?: () => void;
  onDropButtonPress?: () => void;
  onEditButtonPress?: () => void;
  onDeleteButtonPress?: () => void;
  onConfirmButtonPress?: () => void;
};

export const GeneralAppBar = (props: AppBarProps) => {
  const {
    title,
    selectedCount,
    forceSelectMode,
    onBackButtonPress,
    onAddButtonPress,
    onSaveButtonPress,
    onDropButtonPress,
    onEditButtonPress,
    onDeleteButtonPress,
    onConfirmButtonPress,
  } = props;

  if (selectedCount && (selectedCount > 0 || forceSelectMode)) {
    return (
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={onDropButtonPress} />
        <Appbar.Content
          title={selectedCount + ' ' + I18n.t('label_selected')}
        />
        {selectedCount === 1 && onEditButtonPress ? (
          <Appbar.Action icon="pencil" onPress={onEditButtonPress} />
        ) : null}
        <Appbar.Action icon="delete" onPress={onDeleteButtonPress} />
        {onConfirmButtonPress ? (
          <Appbar.Action icon="check" onPress={onConfirmButtonPress} />
        ) : null}
      </Appbar.Header>
    );
  } else {
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
  }
};
