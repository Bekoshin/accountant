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
  },
  sectionContainer: {
    marginBottom: 6,
  },
  label: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.SECONDARY_DARK_1,
    marginHorizontal: 10,
    marginBottom: 12,
  },
  touchableContainer: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 6,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
  },
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
