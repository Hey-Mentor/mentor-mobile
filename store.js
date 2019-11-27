import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

const initialState = {
  contactsList: {
    refreshing: false,
    items: []
  },
  errors: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CONTACTS_LIST':
      return Object.assign({}, {
        ...state,
        contactsList: {
          ...state.contactsList,
          ...action.data
        }
      });
    case 'SET_ERROR':
      return Object.assign({}, {
        ...state,
        errors: [...state.errors, action.data]
      });
    case 'CLEAR_ERROR':
      return Object.assign({}, {
        ...state,
        errors: state.errors.filter(error => error !== action.data)
      });
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default store;
