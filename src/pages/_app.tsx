import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AppLayout from '../components/layouts/AppLayout'
import { useStore } from '../store'
import styles from '../styles/App.module.css'


function MyApp({ Component, pageProps }: AppProps) {
  const { store, persistor } = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout class={ styles.container }>
          <Component {...pageProps} />
        </AppLayout>
      </PersistGate>
    </Provider>
  )
}

export default MyApp
