import React, { PureComponent } from 'react';
import { ScrollView, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';

class Settings extends PureComponent {
  handleLogout = () => {
    AsyncStorage.removeItem('fb_token');
    AsyncStorage.removeItem('fb_id');
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

export default Settings;
