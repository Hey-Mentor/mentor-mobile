import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import { Toast } from 'native-base';
import { Button } from 'react-native-elements';
import * as Facebook from 'expo-facebook';
import CONFIG from '../config.js';

const splashScreenImage = require('../assets/heymentorsplash.png');

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class HomeAuth extends Component {
  // @TODO: look into https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md to clear the issue
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false,
    loadingPlatform: null,
  };

  async componentDidMount() {
    // await AsyncStorage.clear();
    this.attemptLogin();
  }

  onLoginPress = async (platform) => {
    this.setState({ loading: true, loadingPlatform: platform });
    let token;
    if (platform === 'facebook') {
      token = await this.initFacebookLogin();
    } else {
      token = await this.initGoogleLogin();
    }
    if (token) {
      this.attemptLogin();
    }
  };

  getHeyMentorToken = async (token, authType) => {
    const response = await fetch(
      `${API_URL}/register/${authType}?access_token=${token}`,
      { method: 'post' }
    );

    try {
      if (response.status === 401) {
        return false;
      }

      const responseJson = await response.json();
      if (responseJson && !responseJson.error) {
        await AsyncStorage.setItem('hm_token', JSON.stringify(responseJson));
      }
      return true;
    } catch (e) {
      // TODO: Add Sentry logs
    }
    return false;
  };

  async initFacebookLogin() {
    return Facebook.logInWithReadPermissionsAsync(
      CONFIG.FACEBOOK_APP_ID,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    ).then(async (response) => {
      if (response.type === 'cancel') {
        this.setState({ loading: false });
      }

      if (response.type === 'success') {
        AsyncStorage.setItem('fb_token', response.token);
        await this.getFacebookData(response.token);
        this.setState({ loading: false });


        return response.token;
      }

      return null;
    }).catch((err) => {
      // TODO: Add Sentry logs
      Toast.show({
        text: `${err}`,
        buttonText: 'Okay'
      });
    });
  }

  async initGoogleLogin() {
    return Google.logInAsync({
      androidClientId: CONFIG.ANDROID_CLIENT_ID,
      iosClientId: CONFIG.IOS_CLIENT_ID,
      scopes: ['profile', 'email']
    }).then(async (response) => {
      if (response.type === 'cancel') {
        this.setState({ loading: false });
      }

      if (response.type === 'success') {
        AsyncStorage.setItem('g_token', response.accessToken);
        this.setState({ loading: false });
        return response.accessToken;
      }

      return null;
    }).catch((err) => {
      // TODO: Add Sentry logs
      Toast.show({
        text: `${err}`,
        buttonText: 'Okay'
      });
    });
  }

  async attemptLogin() {
    let headerTitle = 'Mentors';
    const localHmToken = await AsyncStorage.getItem('hm_token');
    if (localHmToken !== null) {
      const userType = JSON.parse(localHmToken).user_type;
      if (userType === 'mentor') {
        headerTitle = 'Mentees';
      }
      this.props.navigation.navigate('menteeListView', { headerTitle });
    } else {
      const fbToken = await AsyncStorage.getItem('fb_token');
      const gToken = await AsyncStorage.getItem('g_token');
      const token = fbToken || gToken;
      if (token) {
        const authType = fbToken ? 'facebook' : 'google';
        const success = await this.getHeyMentorToken(token, authType);
        if (success) {
          const hmToken = await AsyncStorage.getItem('hm_token');
          const userType = JSON.parse(hmToken).user_type;
          if (userType === 'mentor') {
            headerTitle = 'Mentees';
          }
          this.props.navigation.navigate('menteeListView', { headerTitle });
        } else {
          // TODO: Add sentry logs
        }
      }
    }
  }

  render() {
    const { loading, loadingPlatform } = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashStyle}
          source={splashScreenImage}
        />
        <TouchableOpacity>
          <Button
            onPress={() => this.onLoginPress('facebook')}
            title="Login with Facebook"
            loading={loading && loadingPlatform === 'facebook'}
            disabled={loading}
            backgroundColor="#007aff"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            onPress={() => this.onLoginPress('google')}
            title="Login with Google"
            loading={loading && loadingPlatform === 'google'}
            disabled={loading}
            backgroundColor="#007aff"
          />
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
    marginTop: 200,
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
    height: 50,
    marginTop: 5
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
