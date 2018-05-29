import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image } from 'react-native';
import { Facebook } from 'expo';
import { Button, Card, CardSection } from '../components/common/';

class HomeAuth extends Component {
  state = {
    facebookLoginFail: false,
    facebookLoginSuccess: false,
    fbToken: null
  };

  onButtonPress() {
    this.facebookLogin();
  }

  onAuthComplete = props => {
    //after user successfully logs in navigate to notifications page
    if (this.state.fbToken) {
      this.props.navigation.navigate('notifications');
    }
  };

  facebookLogin = async () => {
    const token = await AsyncStorage.getItem('fb_token');
    this.initFacebookLogin();
  };

  initFacebookLogin = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '1650628351692070',
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    );

    if (type === 'cancel') {
      this.setState({ facebookLoginFail: true });
    }

    if (type === 'success') {
      await AsyncStorage.setItem('fb_token', token);
      this.setState({
        facebookLoginSuccess: true,
        fbToken: token
      });
      //API call to FB Graph API. Will add more code to fetch social media data
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      console.log(response.json());
      this.onAuthComplete(this.props);
    }
  };

  render() {
    return (
      <View>
        <Image
          style={styles.splashStyle}
          source={require('../assets/heymentorsplash.png')}
        />
        <Button
          style={styles.buttonStyle}
          onPress={this.onButtonPress.bind(this)}
        >
          Login with Facebook
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 150
  },
  splashStyle: {
    marginTop: 150,
    width: 250,
    height: 250,
    alignSelf: 'center'
  }
});

export default HomeAuth;
