import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import Head from 'next/head'

import Link from '../components/commons/Link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [title, setTitle] = useState('Welcome')

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content="Create favorites of your repositories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        component="main"
        maxWidth="md"
        classes={{ root: styles.container }}
      >
        <Box
          sx={{
            marginTop: -8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h2">{ title }!</Typography>
          <Typography
            gutterBottom
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            Create favorite list of your Github repositories.
          </Typography>

          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Link href="/login" noLinkStyle>
              <Button variant="contained" color="primary">
                Sign in
              </Button>
            </Link>

            <Link href="/register" noLinkStyle>
              <Button variant="outlined" color="primary">
                Sign up
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Home
