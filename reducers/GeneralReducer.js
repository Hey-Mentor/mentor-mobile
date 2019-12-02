const initialState = {
  errors: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
