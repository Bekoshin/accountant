import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {AppState} from '../../../store/store';
import Operation from '../../../entities/Operation';
import NoExpenses from '../../noExpenses/noExpenses';
import {FAB} from 'react-native-paper';

export interface HomeProps {
  navigation: any;

  expenses: Operation[];
}

class Home extends React.PureComponent<HomeProps> {
  state = {
    open: false,
  };

  componentDidMount(): void {
    console.log('HOME DID MOUNT');
  }

  componentWillUnmount(): void {
    console.log('HOME WILL UNMOUNT');
  }

  render() {
    const {expenses} = this.props;

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {expenses.length > 0 ? <Text>Home</Text> : <NoExpenses />}
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
              console.log('123');
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
  expenses: state.expense.expenses,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
