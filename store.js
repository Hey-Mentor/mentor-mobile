import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

const initialState = {
  user: {
    refreshingContacts: false,
    contactItem: []
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.data
        }
      };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default store;
