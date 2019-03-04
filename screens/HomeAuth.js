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

const splashScreenImage = require('../assets/heymentorsplash.png');

// import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

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
    //AsyncStorage.clear();
    const token = await AsyncStorage.getItem('fb_token');
    const hmToken = await AsyncStorage.getItem('hm_token');

    console.log('Token: ');
    console.log(token);

    this.setState({
      fbToken: token,
      hmToken
    });

    let headerTitle = 'Mentors';

    if (this.state.hmToken !== null) {
      console.log('Already have HM token');
      // NOTE: We can check here for hmToken.user_type to determine if
      //  we want to display the mentor or mentee view
      console.log('HM Token User Type:');
      const userType = JSON.parse(this.state.hmToken).user_type;
      if (userType === 'mentor') {
        headerTitle = 'Mentees';
      }

      this.props.navigation.navigate('menteeListView', { headerTitle });
    } else {
      console.log('Getting HM token');
      if (this.state.fbToken) {
        console.log('Already have FB token');
        const hmDone = await this.getHeyMentorToken(this.state.fbToken, 'facebook');
        const userType = JSON.parse(hmDone).user_type;
        if (userType === 'mentor') {
          headerTitle = 'Mentees';
        }

        this.props.navigation.navigate('menteeListView', { headerTitle });
      } else {
        console.log('Getting FB token');
        const hmDone = await this.getHeyMentorToken(this.state.fbToken, 'facebook');

        const userType = JSON.parse(hmDone).user_type;
        if (userType === 'mentor') {
          headerTitle = 'Mentees';
        }

        this.props.navigation.navigate('menteeListView', { headerTitle });
      }
    }
  }

  onButtonPress = () => {
    this.setState({ loading: true });
    this.facebookLogin();
  };

  onAuthComplete = () => {
    // after user successfully logs in navigate to menteeListView page
    /*    if (this.state.fbToken) {
      this.props.navigation.state = this.state;

      this.props.navigation.navigate('menteeListView', {
        fbId: this.state.fbUserId
      });
    } */
  };

  getHeyMentorToken = async (token, authType) => {
    const API_URL = 'http://10.91.28.70:8081'; //'http://ppeheymentor-env.qhsppj9piv.us-east-2.elasticbeanstalk.com';

    console.log('Making GetToken request');
    console.log(`${API_URL}/register/${authType}?access_token=${token}`);

    const response = await fetch(
      `${API_URL}/register/${authType}?access_token=${token}`,
      { method: 'post' }
    );
    const responseJson = await response.json();

    console.log('Printing responsejson from GetToken');
    console.log(responseJson);
    console.log('done printing');

    if (responseJson && !responseJson.error) {
      console.log('Setting state');
      this.setState({ hmToken: responseJson });
      await AsyncStorage.setItem('hm_token', JSON.stringify(responseJson));
      console.log('Done setting state');
    } else {
      console.log('Error authenticating with fed token');
    }
  };

  facebookLogin = async () => {
    this.initFacebookLogin();
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
      // this.setState({ facebookLoginFail: true });
    }

    if (type === 'success') {
      // API call to FB Graph API. Will add more code to fetch social media data
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      const responseJson = await response.json();
      console.log('Printing token');
      console.log(token);
      console.log('Printing response');
      console.log(responseJson);
      console.log('Printed response.json()');
      console.log(`Facebook ID: ${responseJson.id}`);

      await AsyncStorage.multiSet([
        ['fb_token', token],
        ['fb_id', responseJson.id]
      ]);
      this.setState({
        // facebookLoginSuccess: true,
        fbToken: token,
        loading: false
      });
      this.onAuthComplete(this.props);
      await AsyncStorage.multiSet([
        ['fb_token', token],
        ['fb_id', responseJson.id]
      ]);
      this.setState({
        fbToken: token
      });
    }

    return token;
  };

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
