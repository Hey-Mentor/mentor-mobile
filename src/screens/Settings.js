import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { Routes } from '../constants';

class Settings extends PureComponent {
  handleLogout = () => {
    this.props.dispatch({ type: 'RESET_USER' });
    this.props.dispatch({ type: 'RESET_MESSAGES' });
    this.props.navigation.navigate(Routes.HOME);
  };

  render() {
    return (
      <ScrollView>
        <Button
          raised
          icon={{ name: 'cached' }}
          title="Logout"
          backgroundColor="#007aff"
          onPress={this.handleLogout}
        />
      </ScrollView>
    );
  }
}

export default connect()(Settings);
