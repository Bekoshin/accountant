import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
import {COLORS} from '../../constants/colors';
import {ifIphoneX} from 'react-native-iphone-x-helper';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerRightContainer: {
    position: undefined,
    flex: 1,
    left: 0,
  },
  scrollViewContent: {
    padding: 10,
  },
  touchableContainer: {
    borderRadius: 5,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 14,
  },
  label: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.SECONDARY_DARK_1,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    ...(TYPOGRAPHY.HEADER_5 as Object),
    color: COLORS.PRIMARY_DARK,
  },
  saveButton: {
    position: 'absolute',
    left: 10,
    right: 10,
    ...ifIphoneX(
      {
        bottom: 44,
      },
      {
        bottom: 10,
      },
    ),
  },
});
