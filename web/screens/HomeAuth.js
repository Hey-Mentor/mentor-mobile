import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Facebook } from 'expo';

class HomeAuth extends Component {
  state = {
    facebookLoginFail: false,
    facebookLoginSuccess: false,
    fbToken: null
  };

  componentDidMount() {
    console.log(this.state);
    if (this.state.fbToken !== null) {
      this.props.navigation.navigate('notifications');
    }
  }

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
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('1650628351692070', {
      permissions: ['public_profile', 'email', 'user_friends']
    });

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
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      console.log(response.json());
      this.onAuthComplete(this.props);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.splashStyle} source={require('../assets/heymentorsplash.png')} />

        <TouchableOpacity style={styles.buttonStyle} onPress={this.onButtonPress.bind(this)}>
          <Text style={styles.textStyle}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  splashStyle: {
    marginTop: 100,
    width: 275,
    height: 275,
    alignSelf: 'center',
    marginBottom: 80
  },
  buttonStyle: {
    backgroundColor: '#007aff',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'center',
    width: 280,
    height: 50
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default HomeAuth;
