import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../store/store';

export interface ShoppingProps {
  navigation: any;
}

class Shopping extends React.PureComponent<ShoppingProps> {
  componentDidMount(): void {
    console.log('SHOPPING DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('SHOPPING WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Shopping</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(Shopping);
