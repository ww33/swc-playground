import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider} from 'jotai'
import React from 'react'

import {store} from '../store'

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Head>
          <title>SWC Playground</title>
          <link rel="shortcut icon" type="image/svg" href="/swc.svg" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default App
