const initialState = {
  user: {},
  contactsList: {
    refreshing: false,
    items: []
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'RESET_USER':
      return Object.assign({}, {
        ...state,
        user: {}
      });
    case 'SET_USER':
      return Object.assign({}, {
        ...state,
        user: {
          ...state.user,
          ...action.data
        }
      });
    case 'SET_CONTACTS_LIST':
      return Object.assign({}, {
        ...state,
        contactsList: {
          ...state.contactsList,
          ...action.data
        }
      });
    default:
      return state;
  }
}
