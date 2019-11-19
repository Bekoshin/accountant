import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpenses from '../../noExpenses/noExpenses';
import {FAB} from 'react-native-paper';
import SegmentedControlTab from 'react-native-segmented-control-tab';

export interface HomeProps {
  navigation: any;

  operations: Operation[];
}

class Home extends React.PureComponent<HomeProps> {
  state = {
    open: false,
    selectedIndex: 0,
  };

  componentDidMount(): void {
    console.log('HOME DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  render() {
    const {operations} = this.props;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {operations.length > 0 ? <Text>Home</Text> : <NoExpenses />}
        <SegmentedControlTab
          values={['Day', 'Month', 'Year']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={index => this.setState({selectedIndex: index})}
        />
        {this.renderFAB()}
      </View>
    );
  }

  renderFAB() {
    return (
      <FAB.Group
        actions={[
          {
            icon: 'check',
            label: 'add operation',
            onPress: () => {
              this.props.navigation.navigate('Operation');
            },
          },
        ]}
        icon="plus"
        visible={true}
        open={this.state.open}
        onStateChange={({open}) => this.setState({open})}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  operations: state.operation.operations,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
