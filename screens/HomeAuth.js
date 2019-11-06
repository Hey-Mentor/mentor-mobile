import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import * as Facebook from 'expo-facebook';
import CONFIG from '../config.js';

const splashScreenImage = require('../assets/heymentorsplash.png');

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class HomeAuth extends Component {
  // @TODO: look into https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md to clear the issue
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false
  };

  async componentDidMount() {
    // await AsyncStorage.clear();
    this.attemptLogin();
  }

  onButtonPress = () => {
    this.setState({ loading: true });
    this.facebookLogin();
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

  async getFacebookData(token) {
    // API call to FB Graph API. Will add more code to fetch social media data
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    const responseJson = await response.json();
    this.fbId = `${responseJson.id}`;

    return responseJson;
  }

  facebookLogin = async () => {
    const token = await this.initFacebookLogin();

    if (token) {
      this.attemptLogin();
    }
  };

  async initFacebookLogin() {
    return Facebook.logInWithReadPermissionsAsync(
      CONFIG.FACEBOOK_APP_ID,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    ).then((response) => {
      if (response.type === 'cancel') {
        this.setState({ loading: false });
      }

      if (response.type === 'success') {
        AsyncStorage.setItem('fb_token', response.token);
        this.getFacebookData(response.token).then(() => {
          this.setState({
            // fbId: responseJson.Id,
            loading: false
          });
        }).catch();

        return response.token;
      }

      return null;
    }).catch(
      // TODO: Add Sentry logs
    );
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
      const token = await AsyncStorage.getItem('fb_token');
      if (token) {
        const success = await this.getHeyMentorToken(token, 'facebook');
        if (success) {
          await AsyncStorage.getItem('hm_token').then((hmToken) => {
            const userType = JSON.parse(hmToken).user_type;
            if (userType === 'mentor') {
              headerTitle = 'Mentees';
            }
            this.props.navigation.navigate('menteeListView', { headerTitle });
          // }).catch((error) => {
            // TODO: Add sentry logs
          });
        } else {
          // TODO: Add sentry logs
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashStyle}
          source={splashScreenImage}
        />

        <TouchableOpacity>
          <Button
            onPress={this.onButtonPress}
            title="Login with Facebook"
            backgroundColor="#007aff"
            loading={this.state.loading}
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
