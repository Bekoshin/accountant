import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_1,
    width: 52,
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  swipeableContainer: {
    backgroundColor: COLORS.BACKGROUND_1,
    borderRadius: 3,
  },
});
