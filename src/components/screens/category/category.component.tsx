import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button, TextInput, TouchableRipple} from 'react-native-paper';

interface CategoryProps {
  navigation: any;
}

class CategoryScreen extends React.PureComponent<CategoryProps> {
  static navigationOptions = {
    title: 'Категория',
    headerRight: () => <Button onPress={() => {
    }}>Сохранить</Button>,
  };

  componentDidMount(): void {
    console.log('CATEGORY DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORY WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>

      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({

});

export default connect(
  mapStateToProps,
  {},
)(CategoryScreen);
