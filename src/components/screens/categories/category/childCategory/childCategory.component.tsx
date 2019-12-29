import styles from './childCategory.styles';
import React, {PureComponent} from 'react';
import {Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'i18n-js';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../../../../entities/Category';
import IMAGES from '../../../../../images';

interface ChildCategoryProps {
  category?: Category;
  navigateToCategory: (category: Category) => void;
}

export default class ChildCategoryComponent extends PureComponent<ChildCategoryProps> {
  onPressHandler = () => {
    const {category, navigateToCategory} = this.props;
    if (category) {
      navigateToCategory(category);
    }
  };

  render() {
    return (
      <TouchableRipple style={styles.mainContainer} onPress={() => {
      }}>
        {this.renderContent()}
      </TouchableRipple>
    );
  }

  renderContent() {
    const {category} = this.props;
    if (category) {
      let imageSource;
      if (category.name === 'petrol') {
        imageSource = IMAGES.PETROL;
        console.log('imageSource: ', imageSource);
        console.log('type: ', typeof imageSource);
      }

      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.renderIcon(category.image)}
          <Text style={styles.headerText}>
            {I18n.t(category.name, {defaultValue: category.name})}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.renderIcon(IMAGES.ADD)}
          <Text style={styles.headerText}>Добавить</Text>
        </View>
      );
    }
  }

  renderIcon(source: number | undefined) {
    if (source) {
      return <Image source={source} style={{width: 40, height: 40}}/>;
    }
  }
}
