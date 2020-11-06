import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../../constants/typography';
import {COLORS} from '../../../constants/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 13,
    paddingRight: 11,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 0.7,
  },
  name: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.PRIMARY_DARK,
  },
  button: {
    flex: 0.3,
    height: 34,
  },
});
