import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import { Facebook } from 'expo';
import { API_URL } from '../config.js';
import { Sentry } from 'react-native-sentry';

const splashScreenImage = require('../assets/heymentorsplash.png');

class HomeAuth extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false
  };

  async componentDidMount() {
    // AsyncStorage.clear();
    this.attemptLogin();
  }

  onButtonPress = () => {
    this.setState({ loading: true });
    this.facebookLogin();
  };

  getHeyMentorToken = async (token, authType) => {
    console.log(`${API_URL}/register/${authType}?access_token=${token}`);

    const response = await fetch(
      `${API_URL}/register/${authType}?access_token=${token}`,
      { method: 'post' }
    );

    console.log(`Response: ${response}`);

    try {
      const responseJson = await response.json();
      if (responseJson && !responseJson.error) {
        console.log('Saving HM token to AsyncStorage');
        await AsyncStorage.setItem('hm_token', JSON.stringify(responseJson));
      }
      console.log('Got response from API: ');
      console.log(responseJson);
      return true;
    } catch (e) {
      console.log('Error authenticating with fed token');
      console.log(e);
    }
    return false;
  };

  async getFacebookData(token) {
    // API call to FB Graph API. Will add more code to fetch social media data
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    const responseJson = await response.json();
    console.log(`Facebook ID: ${responseJson.id}`);
    this.fbId = `${responseJson.id}`;

    return responseJson;
  }

  facebookLogin = async () => {
    const tokenPromise = this.initFacebookLogin();

    tokenPromise.then((token) => {
      if (token) {
        this.attemptLogin();
      } else {
        console.log('Did not get a login token');
      }
    }).catch((error) => {
      console.log('Error while getting facebook token');
      console.log(error);
    });
  };

  async initFacebookLogin() {
    const FACEBOOK_APP_ID = '1650628351692070';

    return Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APP_ID,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    ).then((response) => {
      console.log('Received response from Facebook');
      console.log(response.type);
      console.log(response.token);
      console.log('Done');

      if (response.type === 'cancel') {
        this.setState({ loading: false });
      }

      if (response.type === 'success') {
        AsyncStorage.setItem('fb_token', response.token);
        this.getFacebookData(response.token).then((responseJson) => {
          this.setState({
            // fbId: responseJson.Id,
            loading: false
          });
        }).catch();

        return response.token;
      }

      return null;
    }).catch();
  }

  async attemptLogin() {
    let headerTitle = 'Mentors';
    const localHmToken = await AsyncStorage.getItem('hm_token');
    if (localHmToken !== null) {
      console.log('Already have HM token');

      const userType = JSON.parse(localHmToken).user_type;
      if (userType === 'mentor') {
        headerTitle = 'Mentees';
      }
      this.props.navigation.navigate('menteeListView', { headerTitle });
    } else {
      console.log('Getting HM token');
      const token = await AsyncStorage.getItem('fb_token');
      if (token !== null) {
        const hmPromise = this.getHeyMentorToken(token, 'facebook');
        hmPromise.then((success) => {
          if (success) {
            AsyncStorage.getItem('hm_token').then((hmToken) => {
              const userType = JSON.parse(hmToken).user_type;
              if (userType === 'mentor') {
                headerTitle = 'Mentees';
              }
              this.props.navigation.navigate('menteeListView', { headerTitle });
            }).catch((error) => {
              console.log(`Error in getting HM token from local storage: ${error}`);
            });
          } else {
            console.log('Failed to get HM token from existing FB token');
          }
        }).catch((error) => {
          console.log(`Error in getting HM token: ${error}`);
        });
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
