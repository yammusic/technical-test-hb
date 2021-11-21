import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

// Reducers
import appReducer from './app'
import userReducer from './user'

export default combineReducers({
  app: persistReducer({
    key: 'app',
    storage,
  }, appReducer),

  user: persistReducer({
    key: 'user',
    storage,
    blacklist: [
      'repositories',
      'favorites'
    ],
  }, userReducer),
})