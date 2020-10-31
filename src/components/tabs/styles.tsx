import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
import {COLORS} from '../../constants/colors';

const styles = StyleSheet.create({
  mainContainer: {
    height: 38,
    borderRadius: 4,
    flexDirection: 'row',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...(TYPOGRAPHY.MENU_ITEM as Object),
    color: COLORS.PRIMARY_DARK,
  },
});

export default styles;
