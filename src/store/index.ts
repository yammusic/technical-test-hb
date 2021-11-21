import { useMemo } from 'react'
import { createStore, applyMiddleware, Store } from 'redux'
import { persistReducer, persistStore, Persistor } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import reducers from './reducers'

let store: Store | undefined

let persistor: Persistor | undefined
let persistorConfig = {
  key: 'root',
  storage,
  // blacklist: ['user', 'auth'],
}


function initStore(initialState: any) {
  const persistedReducers = persistReducer(persistorConfig, reducers)

  return createStore(
    persistedReducers,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
    ),
  )
}

function initPersistor(store: Store) {
  const persistor = persistStore(store)
  return persistor
}

export const initializeStore = (preloadedState?: any) => {
  let _store: Store = store ?? initStore(preloadedState)
  let _persistor = persistor ?? initPersistor(_store)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })

    _persistor = initPersistor(_store)

    // Reset the current store
    store = undefined
    persistor = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return {
      store: _store,
      persistor: _persistor,
    }
  }

  // Create the store once in the client
  if (!store) store = _store
  if (!persistor) persistor = _persistor

  return {
    store: _store,
    persistor: _persistor,
  }
}

export function useStore(initialState: any) {
  const { store, persistor } = useMemo(() => initializeStore(initialState), [initialState])
  return { store, persistor }
}

export function getStore() {
  if (!store) {
    return initializeStore()
  }
  return { store, persistor }
}