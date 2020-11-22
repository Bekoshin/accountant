import React, {FunctionComponent} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SwipeableComponent} from '../../swipeableComponent/SwipeableComponent';
import {Card} from '../card/Card';
import {styles} from './styles';

type SwipeableCardProps = {
  onRightButtonPress: () => void;
  onPress: () => void;
  disabledSwipe?: boolean;
  disabledPress?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const SwipeableCard: FunctionComponent<SwipeableCardProps> = (props) => {
  const {
    children,
    onRightButtonPress,
    disabledPress,
    disabledSwipe,
    onPress,
    style,
  } = props;

  return (
    <SwipeableComponent
      style={style}
      onRightButtonPress={onRightButtonPress}
      disabledSwipe={disabledSwipe}>
      <Card style={styles.card} onPress={onPress} disabled={disabledPress}>
        {children}
      </Card>
    </SwipeableComponent>
  );
};
