import React from 'react';
import {View, Text, ScrollView, StyleSheet, NativeScrollEvent, ScrollResponderEvent} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {AppState} from '../../../store/store';
import {Button, TextInput, TouchableRipple} from 'react-native-paper';
import Category from '../../../entities/Category';
import Input from '../../input/input';
import I18n from '../../../i18n/i18n';
import ModalComponent from '../../modal/modal.component';

interface CategoryProps {
  navigation: any;
  category?: Category;
}

interface CategoryState {
  name: string;
  parentCategory: Category | null;
  nameError: string;
  isModalVisible: boolean;
  scrollOffset: undefined | number;
}

class CategoryScreen extends React.PureComponent<CategoryProps, CategoryState> {
  public scrollViewRef: React.RefObject<ScrollView> = React.createRef();
  state = {
    name: this.props.category ? this.props.category.name : '',
    parentCategory: this.props.category
      ? this.props.category.parentCategory
      : null,
    nameError: '',
    isModalVisible: false,
    scrollOffset: undefined,
  };
  handleOnScroll = (event: any) => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });
  };
  handleScrollTo = (position: any) => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo(position);
    }
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  isVisible = () => this.state.isModalVisible;
  close = () => this.setState({isModalVisible: false});

  static navigationOptions = ({navigation}: any) => {
    console.log('test: ', navigation.state.params);
    return {
      title: navigation.getParam('category') ? 'Категория' : 'Новая категория',
      headerRight: () => <Button onPress={() => {
      }}>Сохранить</Button>,
    };
  };

  showNameError = () => {
    this.setState({nameError: I18n.t('label_required')});
  };

  hideNameError = () => {
    this.setState({nameError: ''});
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
              this.toggleModal();
            }}
          />
        </ScrollView>
        <ModalComponent
          isVisible={this.isVisible()}
          close={this.close}
          scrollOffset={this.state.scrollOffset}
          scrollTo={this.handleScrollTo}>
          <View
            style={{
            flex: 1,
            marginTop: 20,
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}>
            <ScrollView
              style={{height: 200}}
              ref={this.scrollViewRef}
              onScroll={this.handleOnScroll}
              scrollEventThrottle={16}>
              <View style={{height: 200, backgroundColor: 'red', margin: 20}}/>
            </ScrollView>
          </View>
        </ModalComponent>
        {/*<Modal*/}
        {/*  style={{margin: 0, justifyContent: 'flex-end'}}*/}
        {/*  isVisible={this.isVisible()}*/}
        {/*  onSwipeComplete={this.close}*/}
        {/*  swipeDirection={['down']}*/}
        {/*  onBackdropPress={this.close}*/}
        {/*  scrollTo={this.handleScrollTo}*/}
        {/*  scrollOffset={this.state.scrollOffset}*/}
        {/*  scrollOffsetMax={400 - 300} // content height - ScrollView height*/}
        {/*  backdropTransitionOutTiming={0}>*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      backgroundColor: 'white',*/}
        {/*      borderTopLeftRadius: 16,*/}
        {/*      borderTopRightRadius: 16,*/}
        {/*      flex: 1,*/}
        {/*      marginTop: 20,*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</Modal>*/}
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
