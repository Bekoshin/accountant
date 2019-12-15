import styles from './category.styles';
import React, {PureComponent} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Category from '../../../../entities/Category';

interface CategoryProps {
  category: Category;
}

export default class CategoryComponent extends PureComponent<CategoryProps> {
  render() {
    const {category} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text>{category.name}</Text>
        </View>
        <ScrollView horizontal={true}>

        </ScrollView>
      </View>
    );
  }
}
