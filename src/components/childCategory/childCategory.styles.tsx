import {StyleSheet} from 'react-native';

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
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;
