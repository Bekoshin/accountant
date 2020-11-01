import {Dimensions, StyleSheet} from 'react-native';
import {ifIphoneX} from "react-native-iphone-x-helper";

const height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  modal: {
    height: height - 100,
  },
  searchbar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginLeft: 13,
    marginRight: 11,
  },
  flatListContainerStyle: {
    paddingBottom: 100,
  },
  addButton: {
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
