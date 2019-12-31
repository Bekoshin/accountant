import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 56,
  },
  label: {
    lineHeight: 12,
    position: 'absolute',
    left: 12,
    top: 8,
    fontSize: 12,
    fontFamily: 'Roboto',
    paddingTop: 0,
    paddingBottom: 0,
    color: 'black',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 24,
    minHeight: 56,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: 'black',
  },
  input: {
    flex: 1,
    minHeight: 56,
    fontSize: 16,
    justifyContent: 'flex-end',
    fontFamily: 'Roboto',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? 18 : 24,
    paddingBottom: 12,
    color: 'black',
  },
  underlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 4,
  },
  helperText: {
    lineHeight: 12,
    fontSize: 12,
    fontFamily: 'Roboto',
    color: 'grey',
  },
  errorText: {
    lineHeight: 12,
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#b00020ff',
  },
});

export default styles;
