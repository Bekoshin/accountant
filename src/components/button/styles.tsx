import {StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';
import {COLORS} from '../../constants/colors';

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 4,
    height: 46,
    alignSelf: 'stretch',
  },
  touchableContainer: {
    borderRadius: 4,
  },
  buttonContainer: {
    height: 46,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    justifyContent: 'center',
  },
  label: {
    ...(TYPOGRAPHY.BUTTON_LABEL as Object),
    color: 'white',
  },
});

export default styles;
