import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../../constants/typography';
import {COLORS} from '../../../constants/colors';

export const styles = StyleSheet.create({
  iconContainer: {
    flex: 0.2,
  },

  categoryNameContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
  categoryName: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.PRIMARY_DARK,
  },
  amountContainer: {
    justifyContent: 'center',
    flex: 0.3,
    alignItems: 'flex-end',
  },
});
