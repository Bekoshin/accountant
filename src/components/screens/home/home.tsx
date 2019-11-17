import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';

export interface HomeProps {
  navigation: any;
}

class Home extends React.PureComponent<HomeProps> {
  componentDidMount(): void {
    console.log('HOME DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(Home);
