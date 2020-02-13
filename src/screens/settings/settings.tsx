import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';

export interface SettingsProps {
  navigation: any;
}

class Settings extends React.PureComponent<SettingsProps> {
  componentDidMount(): void {
    console.log('SETTINGS DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('SETTINGS WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Settings</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(Settings);
