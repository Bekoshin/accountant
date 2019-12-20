import styles from './childCategory.styles';
import React, {PureComponent} from 'react';
import {Text, View, Image, ImageSourcePropType} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'i18n-js';
import {TouchableRipple} from 'react-native-paper';
import Category from '../../../../../entities/Category';
import IMAGES from "../../../../../images";

interface ChildCategoryProps {
    category?: Category;
}

export default class ChildCategoryComponent extends PureComponent<ChildCategoryProps> {
    render() {
        return (
            <TouchableRipple style={{borderRadius: 4, margin: 8}} onPress={() => {
            }}>
                <View style={styles.mainContainer}>{this.renderContent()}</View>
            </TouchableRipple>
        );
    }

    renderContent() {
        const {category} = this.props;
        if (category) {
            let imageSource;
            if (category.name === 'petrol') {
                imageSource = IMAGES.PETROL;
            }

            return (
                <View
                    style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
                    {this.renderIcon(imageSource)}
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
                    <Icon name="plus" size={48}/>
                    <Text style={styles.headerText}>Добавить</Text>
                </View>
            );
        }
    }

    renderIcon(source: ImageSourcePropType) {
        if (source) {
            return (
                <Image source={source} style={{width: 40, height: 40}}/>
            );
        }
    }
}
