import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
import {COLORS} from '../../constants/colors';

const styles = StyleSheet.create({
  touchableContainer: {
    margin: 8,
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
    backgroundColor: '#fcfcfc',
  },
  contentContainer: {
    flex: 1,
    padding: 4,
    height: 90,
    width: 90,
    borderRadius: 4,
  },
  categoryContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryName: {
    ...(TYPOGRAPHY.TEXT_LINK as Object),
    color: COLORS.PRIMARY_DARK,
    textAlign: 'center',
  },
});

export default styles;
