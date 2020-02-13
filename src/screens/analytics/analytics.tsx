import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';

export interface AnalyticsProps {
  navigation: any;
}

class Analytics extends React.PureComponent<AnalyticsProps> {
  componentDidMount(): void {
    console.log('ANALYTICS DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('ANALYTICS WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Analytics</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(Analytics);
