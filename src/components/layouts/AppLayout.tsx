import { CssBaseline, ThemeProvider } from '@mui/material'
import Head from 'next/head'
import React from 'react'

import theme from '../../theme'

type Props = {
  children: React.ReactNode
  class?: string
}

const AppLayout = (props: Props) => {
  const { children, class: className } = props

  return (
    <>
      <Head>
        <title>Hello Build!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <ThemeProvider theme={ theme }>
        <CssBaseline />

        <div id="AppContainer" className={ className }>
          { children }
        </div>
      </ThemeProvider>
    </>
  )
}

export default AppLayout