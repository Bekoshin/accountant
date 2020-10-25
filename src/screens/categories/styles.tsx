import {StyleSheet} from 'react-native';
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
  editButtonContainer: {
    marginLeft: 13,
  },
  scrollViewContent: {
    paddingBottom: 90,
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
