import styles from './childCategory.styles';
import React, {PureComponent} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Category from '../../../../../entities/Category';

interface ChildCategoryProps {
  category?: Category;
}

export default class ChildCategoryComponent extends PureComponent<
  ChildCategoryProps
> {
  render() {
    return <View style={styles.mainContainer}>{this.renderContent()}</View>;
  }

  renderContent() {
    const {category} = this.props;
    if (category) {
      return (
        <View style={styles.header}>
          <Text>{category.name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.header}>
          <Text>Добавить</Text>
        </View>
      );
    }
  }
}
