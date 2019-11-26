
/* eslint-disable import/prefer-default-export */
import { Toast } from 'native-base';
import CONFIG from './config.js';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

export function constructContactItemsWithToken(token) {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'SET_USER_DATA',
        data: {
          refreshingContacts: true
        }
      });
      const response = await fetch(`${API_URL}/contacts/${token._id}?token=${token.api_key}`);
      if (!response.ok) {
        throw new Error(`Failed with status code: ${response.status}`);
      }
      const contactData = (await response.json()).contacts.map(contact => ({
        name: `${contact.person.fname} ${contact.person.lname}`,
        school: contact.school.name,
        grade: contact.school.grade,
        id: contact._id,
        facebook_id: contact.facebook_id,
        fullContact: contact
      }));
      if (contactData.length === 0) {
        Toast.show({
          text: 'Hmm, nobody\'s here, get in touch with Hey Mentor to get paired with someone.',
          buttonText: 'Okay',
          duration: 10000
        });
      }
      dispatch({
        type: 'SET_USER_DATA',
        data: {
          contactItem: contactData
        }
      });
    } catch (err) {
      Toast.show({
        text: `${err}`,
        buttonText: 'Okay',
        duration: -1
      });
    }
    dispatch({
      type: 'SET_USER_DATA',
      data: {
        refreshingContacts: false
      }
    });
  };
}
