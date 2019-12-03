import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Toast } from 'native-base';
import { Button } from 'react-native-elements';
import { initFacebookLogin, initGoogleLogin, getHeyMentorToken } from '../actions';

const splashScreenImage = require('../assets/heymentorsplash.png');

class HomeAuth extends Component {
  // @TODO: look into https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md to clear the issue
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  state = {};

  async componentDidMount() {
    // await AsyncStorage.clear();
    this.attemptLogin();
  }

  componentDidUpdate(prevProps) {
    const { errors, dispatch } = this.props;
    if (errors) {
      errors.forEach((error) => {
        dispatch({
          type: 'CLEAR_ERROR',
          data: error
        });
        Toast.show({
          text: error.text,
          buttonText: 'Okay',
          duration: 10000
        });
      });
    }
    if (this.props.user && this.props.user.hmToken && this.props.user.hmToken !== prevProps.user.hmToken) {
      this.checkHmToken();
    }
  }

  onLoginPress = async (platform) => {
    if (platform === 'facebook') {
      this.props.dispatch(initFacebookLogin());
    } else {
      this.props.dispatch(initGoogleLogin());
    }
  };

  checkHmToken() {
    const { user } = this.props;
    if (user.hmToken) {
      const userType = user.hmToken.user_type;
      const headerTitle = userType === 'mentor' ? 'Mentees' : 'Mentors';
      this.props.navigation.navigate('menteeListView', { headerTitle });
    }
  }

  async attemptLogin() {
    const { user } = this.props;
    if (user.hmToken == null) {
      const token = user.fbToken || user.gToken;
      if (token) {
        const authType = user.fbToken ? 'facebook' : 'google';
        this.props.dispatch(getHeyMentorToken(token, authType));
      }
    } else {
      this.checkHmToken();
    }
  }

  render() {
    const { loading, loadingPlatform } = this.props.user;
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
            buttonStyle={styles.buttonStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            onPress={() => this.onLoginPress('google')}
            title="Login with Google"
            loading={loading && loadingPlatform === 'google'}
            disabled={loading}
            buttonStyle={[styles.buttonStyle, styles.googleButton]}
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
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'center',
    width: 280,
    height: 50,
    marginTop: 5
  },
  googleButton: {
    backgroundColor: '#DD4B39',
    borderColor: '#DD4B39'
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

export default connect(state => ({
  user: state.persist.user,
  errors: state.general.errors,
}))(HomeAuth);
