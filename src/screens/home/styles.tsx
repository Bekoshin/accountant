import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerRightContainer: {
    position: undefined,
    flex: 1,
    left: 0,
  },
  filterIconBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.SECONDARY_3,
    height: 8,
    width: 8,
    borderRadius: 100,
  },
});
