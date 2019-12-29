import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button, TextInput, TouchableRipple} from 'react-native-paper';
import Category from '../../../entities/Category';
import Input from '../../input/input';

interface CategoryProps {
  navigation: any;
  category?: Category;
}

interface CategoryState {
  name: string;
  parentCategory: Category | null;
}

class CategoryScreen extends React.PureComponent<CategoryProps, CategoryState> {
  state = {
    name: this.props.category ? this.props.category.name : '',
    parentCategory: this.props.category
      ? this.props.category.parentCategory
      : null,
  };

  static navigationOptions = ({navigation}: any) => {
    console.log('test: ', navigation.state.params);
    return {
      title: navigation.getParam('category') ? 'Категория' : 'Новая категория',
      headerRight: () => <Button onPress={() => {}}>Сохранить</Button>,
    };
  };

  componentDidMount(): void {
    // this.props.navigation.setParams({
    //   title: this.props.category ? 'Категория' : 'Новая категория',
    // });
    console.log('CATEGORY DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORY WILL UNMOUNT');
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <TextInput
          label="Наименование"
          mode="outlined"
          value={this.state.name}
          onChangeText={this.changeCategoryName}
        />
        <Input label="Parent category" value="test" />
      </View>
    );
  }

  changeCategoryName = (name: string) => {
    this.setState({name: name});
  };
}

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  {},
)(CategoryScreen);
