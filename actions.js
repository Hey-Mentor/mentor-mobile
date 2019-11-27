
/* eslint-disable import/prefer-default-export */
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
      const contactData = (await response.json()).contacts.map(contact => ({
        name: `${contact.person.fname} ${contact.person.lname}`,
        school: contact.school.name,
        grade: contact.school.grade,
        id: contact._id,
        facebook_id: contact.facebook_id,
        fullContact: contact
      }));
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
