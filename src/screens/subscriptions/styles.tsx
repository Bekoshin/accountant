import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
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
  flatListContentContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  sectionContainer: {
    marginBottom: 6,
  },
  label: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.SECONDARY_DARK_1,
    marginBottom: 12,
  },
  subscriptionCard: {
    marginBottom: 6,
  },
});
