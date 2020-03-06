import React, {useState} from 'react';
import {FAB} from 'react-native-paper';
import {styles} from './fab.styles';
import I18n from '../../../i18n/i18n';

interface FabProps {
  addOperation: () => void;
  addSubscription: () => void;
}

export const Fab = (props: FabProps) => {
  const [isOpen, changeIsOpen] = useState(false);
  const {addOperation, addSubscription} = props;

  return (
    <FAB.Group
      visible={true}
      fabStyle={styles.fab}
      open={isOpen}
      icon="plus"
      onStateChange={({open}) => changeIsOpen(open)}
      actions={[
        {
          icon: 'calendar-plus',
          label: I18n.t('action_add_subscription'),
          onPress: addSubscription,
        },
        {
          icon: 'plus',
          label: I18n.t('action_add_operation'),
          onPress: addOperation,
        },
      ]}
    />
  );
}
