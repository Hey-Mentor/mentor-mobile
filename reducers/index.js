import { combineReducers } from 'redux';
import persist from './PersistReducer';
import general from './GeneralReducer';

export const persistWhitelist = { persist };
export const persistBlacklist = { general };

const rootReducer = combineReducers({
  ...persistWhitelist,
  ...persistBlacklist,
});

export default rootReducer;
