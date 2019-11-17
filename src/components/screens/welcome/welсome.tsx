import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import StorageHandler from '../../../storage/StorageHandler';

export interface WelcomeProps {
  navigation: any;
}

class Welcome extends React.PureComponent<WelcomeProps> {
  async componentDidMount() {
    console.log('WELCOME DID MOUNT');
    let storageHandler = new StorageHandler();
    await storageHandler.connect();

    this.props.navigation.navigate('App');
  }

  componentWillUnmount(): void {
    console.log('WELCOME WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Welcome Screen</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(Welcome);
