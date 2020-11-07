import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
import {COLORS} from '../../constants/colors';

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 8,
  },
  contentContainer: {
    flex: 1,
    marginVertical: 8,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  scrollView: {
    marginVertical: 8,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  parenCategoryName: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.PRIMARY_DARK,
  },
});

export default styles;
