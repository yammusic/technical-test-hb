import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'

import Link from '../components/commons/Link'
import AuthService from '../services/Auth.service'
import { isValidLoginData } from '../utils/validators/user'
import { saveCurrentUser } from '../store/actions/user'
import { LoginUser } from '../types/user.types'

import styles from '../styles/Login.module.css'

const Login: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const state: RootStateOrAny = useSelector((state) => state)
  const { app, user } = state
  AuthService.baseUrl = app?.apiBaseUrl

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [title, setTitle] = useState('Sign in')

  useEffect(() => {
    if (user?.currentUser) {
      router.replace('/profile')
    }
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      onCloseAlert()
      setLoading(true)

      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData) as unknown as LoginUser

      if (isValidLoginData(data)) {
        const { email, password } = data
        const res = await AuthService.login(email, password)
        setLoading(false)

        if (res?.error) {
          return showError(res.message)
        }

        await dispatch(saveCurrentUser(res.user))
        router.replace('/profile')
      }

      setLoading(false)
    } catch (error: any) {
      showError(error.message ?? error)
      setLoading(false)
      console.warn(error)
    }
  }

  const showError = (message: any) => {
    setError(true)
    setAlertMessage(message)
    setShowAlert(true)
  }

  const onCloseAlert = () => {
    setShowAlert(false)
    setAlertMessage('')
    setError(false)
  }

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content="Sing in our app" />
      </Head>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenIcon />
          </Avatar>

          <Typography component="h1" variant="h5">{ title }</Typography>

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  label="Remember me"
                  control={
                    <Checkbox name="rememberMe" color="primary" />
                  }
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enter
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/register">
                  { 'Don\'t have an account ? Sign up' }
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={onCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={onCloseAlert}
            severity={ error ? 'error' : 'success' }
            sx={{ width: '100%' }}
          >
            { alertMessage }
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}

export default Login
