import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

import { Button } from 'react-native-elements';

import { Facebook } from 'expo';

class HomeAuth extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false,
    facebookLoginFail: false,
    facebookLoginSuccess: false,
    googleLoginFail: false,
    googleLoginSuccess: false,
    fbToken: null,
    fbUserId: null,
    googleToken: null,
    googleUserId: null
  };

  appId = '1650628351692070';
  androidClientId = '12899066904-jqhmi5uhav530aerctj631gltumqvk8i.apps.googleusercontent.com';
  //appId = '413723559041218';

  async componentDidMount() {
    const fbToken = await AsyncStorage.getItem('fb_token');
    const fbId = await AsyncStorage.getItem('fb_id');
    const gToken = await AsyncStorage.getItem('g_token');
    const gId = await AsyncStorage.getItem('g_id');

    this.setState({
      fbToken: fbToken,
      fbUserId: fbId,
      googleToken: gToken,
      googleUserId: gId
    });

    if (this.state.fbToken !== null) {
      if (this.state.fbUserId !== null){
        this.props.navigation.navigate('menteeListView');
      }else{
        // We have an access token, but not the fb user ID
        this.initFacebookLogin();
      }
    }
    if (this.state.googleToken !== null) {
      if (this.state.googleUserId !== null) {
        this.props.navigation.navigate('menteeListView');
      } else {
        this.initGoogleLogin();
      }
    }
  }

  onButtonPressFB = () => {
    this.setState({ loading: true });
    this.facebookLogin();
  };

  onButtonPressGoogle = () => {
    this.setState({ loading: true});
    this.googleLogin();
  }

  onAuthComplete = props => {
    //after user successfully logs in navigate to menteeListView page
    if (this.state.fbToken) {
      this.props.navigation.state = this.state;

      this.props.navigation.navigate('menteeListView', {
        fbId: this.state.fbUserId
      });
    }
    if (this.state.googleToken) {
      this.props.navigation.state = this.state;

      this.props.navigation.navigate('menteeListView', {
        gId: this.state.googleUserId
      });
    }
  };

  facebookLogin = async () => {
    const token = await AsyncStorage.getItem('fb_token');
    this.initFacebookLogin();
  };

  googleLogin = async () => {
    const token = await AsyncStorage.getItem('g_token');
    this.initGoogleLogin();
  }

  initFacebookLogin = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      this.appId,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    );

    if (type === 'cancel') {
      this.setState({ facebookLoginFail: true });
    }

    console.log("HEREHERE");

    if (type === 'success') {
      //API call to FB Graph API. Will add more code to fetch social media data
      let response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      let responseJson = await response.json();
      console.log('Printing token');
      console.log(token);
      console.log('Printing response');
      console.log(responseJson);
      console.log('Printed response.json()');

      // Get the Facebook User ID from the response so we can look up the Mentees of this user
      console.log('Facebook ID: ' + responseJson.id);
      // Matt Bongiovi: 1842505195770400

      await AsyncStorage.multiSet([
        ['fb_token', token],
        ['fb_id', responseJson.id]
      ]);
      this.setState({
        facebookLoginSuccess: true,
        fbToken: token,
        fbUserId: responseJson.id,
        loading: false
      });
      this.onAuthComplete(this.props);
      await AsyncStorage.multiSet([
        ['fb_token', token],
        ['fb_id', responseJson.id]
      ]);
      this.setState({
        facebookLoginSuccess: true,
        fbToken: token,
        fbUserId: responseJson.id
      });
    }
  };

  initGoogleLogin = async () => {
  try {
      const result = await Expo.Google.logInAsync({
        androidClientId: this.androidClientId,
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        console.log('Printing token');
        console.log(result.accessToken);
        await AsyncStorage.multiSet([
          ['g_token', result.accessToken],
          ['g_id', result.user.id]
        ]);
        this.setState({
          googleLoginSuccess: true,
          googleToken: result.accessToken,
          googleUserId: result.user.id,
          loading: false
        });
        this.onAuthComplete(this.props);
        await AsyncStorage.multiSet([
          ['g_token', result.accessToken],
          ['g_id', result.user.id]
        ]);
        this.setState({
          googleLoginSuccess: true,
          googleToken: result.accessToken,
          googleUserId: result.user.ids
        });
          this.setState({
            googleLoginSuccess: true,
            googleUserId: result.user.id,
            googleToken: result.accessToken
          })
      } else {
        console.log("cancelled")
      }

    } catch (e) {
      console.log("error", e)
    }  
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashStyle}
          source={require('../assets/heymentorsplash.png')}
        />


        <TouchableOpacity>
          <Button
            onPress={this.onButtonPressFB}
            title="Login with Facebook"
            backgroundColor="#007aff"
            loading={this.state.loading}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            onPress={this.onButtonPressGoogle}
            title="Login with Google"
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
