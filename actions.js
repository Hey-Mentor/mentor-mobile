
/* eslint-disable import/prefer-default-export */
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import CONFIG from './config.js';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

export function constructContactItemsWithToken(token) {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'SET_CONTACTS_LIST',
        data: {
          refreshingContacts: true
        }
      });
      const response = await fetch(`${API_URL}/contacts/${token._id}?token=${token.api_key}`);
      if (!response.ok) {
        throw new Error(`Failed with status code: ${response.status}`);
      }
      let contactData = (await response.json()).contacts.map(contact => ({
        name: `${contact.person.fname} ${contact.person.lname}`,
        school: contact.school.name,
        grade: contact.school.grade,
        id: contact._id,
        facebook_id: contact.facebook_id,
        fullContact: contact
      }));
      const usersWithChannels = [{
        id: '5c15446bbf35ae4057222222',
        name: 'Johnny',
        // @TODO: add channel
        // channel: ''
      }, {
        id: '5c15446bbf35ae4057111111',
        name: 'Nancy',
        channel: '5c15446bbf35ae4057222222.5c15446bbf35ae4057111111'
      }];
      if (CONFIG.ENV !== 'PROD') {
        contactData = contactData
          .filter(contact => usersWithChannels.map(({ id }) => id).includes(contact.id))
          .map((contact) => {
            // eslint-disable-next-line no-param-reassign
            contact.channel = usersWithChannels.find(({ id }) => id === contact.id).channel;
            return contact;
          });
      }
      console.log(JSON.stringify(contactData))
      if (contactData.length === 0) {
        dispatch({
          type: 'SET_ERROR',
          data: {
            text: 'Hmm, nobody\'s here, get in touch with Hey Mentor to get paired with someone.',
          }
        });
      }
      dispatch({
        type: 'SET_CONTACTS_LIST',
        data: {
          items: contactData
        }
      });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        data: {
          text: `${err}`,
        }
      });
    }
    dispatch({
      type: 'SET_CONTACTS_LIST',
      data: {
        refreshingContacts: false
      }
    });
  };
}

export function getHeyMentorToken(token, authType) {
  return async (dispatch) => {
    dispatch({
      type: 'SET_USER',
      data: {
        loading: true,
      }
    });
    const response = await fetch(
      `${API_URL}/register/${authType}?access_token=${token}`,
      { method: 'post' }
    );

    try {
      const responseJson = await response.json();
      if (responseJson && !responseJson.error) {
        // eslint-disable-next-line camelcase
        const { _id, user_type, api_key } = responseJson;
        dispatch({
          type: 'SET_USER',
          data: {
            hmToken: {
              _id,
              user_type,
              api_key
            },
          }
        });
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        data: {
          text: `${err}`,
        }
      });
    }
    dispatch({
      type: 'SET_USER',
      data: {
        loading: false,
      }
    });
  };
}

export function initFacebookLogin() {
  return async (dispatch) => {
    dispatch({
      type: 'SET_USER',
      data: {
        loading: true,
        loadingPlatform: 'facebook'
      }
    });
    try {
      await Facebook.initializeAsync(CONFIG.FACEBOOK_APP_ID);
      const response = await Facebook.logInWithReadPermissionsAsync(
        {
          permissions: ['public_profile', 'email', 'user_friends']
        }
      );
      if (response.type === 'success') {
        dispatch({
          type: 'SET_USER',
          data: {
            fbToken: response.token,
          }
        });
        dispatch(getHeyMentorToken(response.token, 'facebook'));
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        data: {
          text: `${err}`,
        }
      });
    }
    dispatch({
      type: 'SET_USER',
      data: {
        loading: false,
      }
    });
  };
}

export function initGoogleLogin() {
  return async (dispatch) => {
    dispatch({
      type: 'SET_USER',
      data: {
        loading: true,
        loadingPlatform: 'google'
      }
    });
    const response = await Google.logInAsync({
      androidClientId: CONFIG.ANDROID_CLIENT_ID,
      iosClientId: CONFIG.IOS_CLIENT_ID,
      scopes: ['profile', 'email']
    });
    try {
      if (response.type === 'success') {
        dispatch({
          type: 'SET_USER',
          data: {
            gToken: response.accessToken
          }
        });
        dispatch(getHeyMentorToken(response.accessToken, 'google'));
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        data: {
          text: `${err}`,
        }
      });
    }
    dispatch({
      type: 'SET_USER',
      data: {
        loading: false,
      }
    });
  };
}
