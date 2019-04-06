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

const splashScreenImage = require('../assets/heymentorsplash.png');

class HomeAuth extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false,
    fbToken: null,
    hmToken: {}
  };

  async componentDidMount() {
    AsyncStorage.clear();
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
    let responseJson = {};
    try {
      responseJson = await response.json();
      console.log(responseJson);
    } catch (e) {
      console.log('Error authenticating with fed token');
      console.log(e);
    }

    if (responseJson && !responseJson.error) {
      await AsyncStorage.setItem('hm_token', JSON.stringify(responseJson));
      return responseJson;
    }

    console.log('Error authenticating with fed token');
    return null;
  };

  facebookLogin = async () => {
    const token = this.initFacebookLogin();

    if (token) {
      this.attemptLogin();
    } else {
      console.log('Did not get a login token');
    }
  };

  initFacebookLogin = async () => {
    const FACEBOOK_APP_ID = '1650628351692070';

    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_APP_ID,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    );

    if (type === 'cancel') {
      this.setState({ loading: false });
    }

    if (type === 'success') {
      // API call to FB Graph API. Will add more code to fetch social media data
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      const responseJson = await response.json();
      console.log(`Facebook ID: ${responseJson.id}`);

      await AsyncStorage.multiSet([
        ['fb_token', token],
        ['fb_id', responseJson.id]
      ]);

      this.setState({
        fbToken: token,
        loading: false
      });
    }

    return token;
  };

  async attemptLogin() {
    const token = await AsyncStorage.getItem('fb_token');
    const hmToken = await AsyncStorage.getItem('hm_token');

    this.setState({
      fbToken: token,
      hmToken
    });

    let headerTitle = 'Mentors';

    if (this.state.hmToken !== null) {
      console.log('Already have HM token');
      const userType = JSON.parse(this.state.hmToken).user_type;
      if (userType === 'mentor') {
        headerTitle = 'Mentees';
      }
      this.props.navigation.navigate('menteeListView', { headerTitle });
    } else {
      console.log('Getting HM token');
      if (this.state.fbToken !== null) {
        const hmDone = await this.getHeyMentorToken(this.state.fbToken, 'facebook');
        const userType = JSON.parse(hmDone).user_type;
        if (userType === 'mentor') {
          headerTitle = 'Mentees';
        }

        this.props.navigation.navigate('menteeListView', { headerTitle });
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
