import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import {Button, TextInput} from 'react-native-paper';

export interface CategoriesProps {
  navigation: any;

  operations: Operation[];
}

class CategoriesScreen extends React.PureComponent<CategoriesProps> {
  static navigationOptions = {
    title: 'Операция',
    headerRight: () => <Button onPress={() => {}}>Сохранить</Button>,
  };

  componentDidMount(): void {
    console.log('OPERATION DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('OPERATION WILL UNMOUNT');
  }

  render() {
    const {operations} = this.props;

    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <TextInput label="Сумма"/>
        <TextInput label="Категория"/>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operation.operations,
});

export default connect(
  mapStateToProps,
  {},
)(CategoriesScreen);
