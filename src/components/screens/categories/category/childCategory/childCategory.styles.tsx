import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    height: 90,
    width: 90,
    backgroundColor: '#fcfcfc',
    margin: 8,
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    padding: 4,
    elevation: 4,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 14,
  },
});

export default styles;
