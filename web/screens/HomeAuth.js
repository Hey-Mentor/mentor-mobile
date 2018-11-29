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

//import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

class HomeAuth extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false,
    facebookLoginFail: false,
    facebookLoginSuccess: false,
    fbToken: null,
    fbUserId: null,
    hmToken: {},
    backendBase: "http://10.91.28.70:3002"
  };

  appId = '1650628351692070';
  //appId = '413723559041218';

  async componentDidMount() {
    const token = await AsyncStorage.getItem('fb_token');
    const id = await AsyncStorage.getItem('fb_id');
    const hmToken = await AsyncStorage.getItem('hm_token');

    console.log("Token: -------------------------------------");
    console.log(token);

    this.setState({
      fbToken: token,
      fbUserId: id,
      hmToken: hmToken
    });

    if (this.state.hmToken !== null) {
      console.log("Already have HM token");
      // NOTE: We can check here for hmToken.user_type to determine if we want to display the mentor or mentee view 
      this.props.navigation.navigate('menteeListView');
    }else{
      console.log("Getting HM token");
      if(this.state.fbToken){
        console.log("Already have FB token");
        var hmDone = await this.getHeyMentorToken(this.state.fbToken, "facebook");
        this.props.navigation.navigate('menteeListView');
      }else{
        console.log("Getting FB token");
        var fb_token = await this.initFacebookLogin();
        var hmDone = await this.getHeyMentorToken(this.state.fbToken, "facebook");
        this.props.navigation.navigate('menteeListView');
      }      
    }
  }
  
  onButtonPress = () => {
    this.setState({ loading: true });
    this.facebookLogin();
  };

  onAuthComplete = props => {
    //after user successfully logs in navigate to menteeListView page
    if (this.state.fbToken) {
      this.props.navigation.state = this.state;

      this.props.navigation.navigate('menteeListView', {
        fbId: this.state.fbUserId
      });
    }
  };

  getHeyMentorToken = async (token, authType) => {

    console.log("Making GetToken request");
    console.log(`${this.state.backendBase}/token/${token}/${authType}`);

    let response = await fetch(
      `${this.state.backendBase}/token/${token}/${authType}`
    );
    let responseJson = await response.json();

    console.log('Printing responsejson from GetToken');
    console.log(responseJson);
    console.log("done printing");

    if(responseJson && !responseJson.error){
      console.log("Setting state");
      this.setState({ hmToken: responseJson });
      console.log("Done setting state");
    }else{
      console.log("Error authenticating with fed token");
    }   
  };

  facebookLogin = async () => {
    const token = await AsyncStorage.getItem('fb_token');
    this.initFacebookLogin();
  };

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

    return token;
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashStyle}
          source={require('../assets/heymentorsplash.png')}
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
