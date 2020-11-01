import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingTop: 13,
  },
  headerView: {
    height: 5,
    width: 64,
    backgroundColor: COLORS.OUTLINE,
    borderRadius: 2.5,
    marginBottom: 11,
    alignSelf: 'center',
  },
});
