import {Platform, StyleSheet} from 'react-native';
import {TYPOGRAPHY} from '../../constants/typography';

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    left: Platform.OS === 'ios' ? -36 : 0,
    right: 0,
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 42,
  },
  title: {
    ...(TYPOGRAPHY.HEADER_4 as Object),
    marginRight: 5,
  },
  searchButton: {
    marginRight: 13,
  },
  searchBar: {
    flex: 1,
    marginBottom: 2,
    marginRight: -13,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  childrenContainer: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  dropDownMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 42,
  },
  dropDownMenuLabel: {
    ...(TYPOGRAPHY.HEADER_4 as Object),
    marginRight: 5,
  },
});
export default styles;
