import {Appbar} from 'react-native-paper';
import React from 'react';

type SubscriptionsAppBarProps = {
  title: string;
  onBackButtonPress: () => void;
};

export const SubscriptionsAppBar = (props: SubscriptionsAppBarProps) => {
  const {title, onBackButtonPress} = props;
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={onBackButtonPress} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};
