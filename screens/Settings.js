import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

class Settings extends PureComponent {
  handleLogout = () => {
    this.props.dispatch('RESET_USER');
    this.props.navigation.navigate('home');
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
