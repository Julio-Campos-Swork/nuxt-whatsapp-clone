import '@/styles/globals.css'
import Head from 'next/head'
import { StateProvider } from '@/context/StateContext'
import reducer, { initialState } from '@/context/StateReducers'
export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Whatsapp Clone</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  )
}
