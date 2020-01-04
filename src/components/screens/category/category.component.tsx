import React from 'react';
import {View, ScrollView, Text, Modal, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import {Button} from 'react-native-paper';
import Category from '../../../entities/Category';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';

interface CategoryProps {
  navigation: any;
  category?: Category;
  categories: Category[];
}

interface CategoryState {
  name: string;
  parentCategory: Category | null;
  nameError: string;
}

class CategoryScreen extends React.PureComponent<CategoryProps, CategoryState> {
  state = {
    name: this.props.category ? this.props.category.name : '',
    parentCategory: this.props.category
      ? this.props.category.parentCategory
      : null,
    nameError: '',
  };

  static navigationOptions = ({navigation}: any) => {
    console.log('test: ', navigation.state.params);
    return {
      title: navigation.getParam('category') ? 'Категория' : 'Новая категория',
      headerRight: () => <Button onPress={() => {}}>Сохранить</Button>,
    };
  };

  showNameError = () => {
    this.setState({nameError: I18n.t('label_required')});
  };

  hideNameError = () => {
    this.setState({nameError: ''});
  };

  componentDidMount(): void {
    console.log('CATEGORY DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('CATEGORY WILL UNMOUNT');
  }

  render() {
    const {name, parentCategory} = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 8}}>
        <ScrollView>
          <Input
            label="Наименование"
            value={name}
            required={true}
            errorMessage={this.state.nameError}
            onFocus={this.hideNameError}
            onChangeText={this.changeCategoryName}
          />
          <Input
            label="Parent category"
            value={parentCategory ? parentCategory.name : ''}
            editable={false}
            onInputPress={() => {
              this.props.navigation.navigate('ParentCategories');
            }}
          />
        </ScrollView>
      </View>
    );
  }

  changeCategoryName = (name: string) => {
    this.setState({name: name});
  };
}

const mapStateToProps = (state: AppState) => ({
  categories: state.category.categories,
});

export default connect(
  mapStateToProps,
  {},
)(CategoryScreen);
