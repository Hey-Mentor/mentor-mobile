import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import reducer, { persistWhitelist, persistBlacklist } from '../reducers/index';

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  whitelist: Object.keys(persistWhitelist),
  blacklist: Object.keys(persistBlacklist),
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, applyMiddleware(thunkMiddleware, logger));

export const persistor = persistStore(store);
export default store;
