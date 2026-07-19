import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice.js'
import { userReducer } from './user/userSlice.js'
import { activeCardReducer } from './activeCard/activeCardSlice.js'
import { notificationsReducer } from './notifications/notificationsSlice.js'

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default la localStorage

const rootPersistConfig = {
  key: 'root', // key cua persist do chung ta chi dinh
  storage,
  whitelist: ['user'] // dinh nghia cac slice du lieu duoc phep duy tri qua moi lan f5 trinh duyet
}

// combine cac reducer lai voi nhau
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  user: userReducer,
  notifications: notificationsReducer
})

// Thuc hien persist reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error when implement redux-persist with redux-toolkit
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})