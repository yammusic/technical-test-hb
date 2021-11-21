import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'

import Link from '../components/commons/Link'
import RegisterForm from '../components/commons/RegisterForm'
import AuthService from '../services/Auth.service'
import { isValidRegisterData } from '../utils/validators/user'
import { saveCurrentUser } from '../store/actions/user'
import { RegisterUser } from '../types/user.types'

import styles from '../styles/Register.module.css'

const Register: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const state: RootStateOrAny = useSelector((state) => state)
  const {
    app: { apiBaseUrl },
    user: { currentUser },
  } = state
  AuthService.baseUrl = apiBaseUrl

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [title, setTitle] = useState('Sign up')

  useEffect(() => {
    if (currentUser) {
      router.push('/profile')
    }
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      onCloseAlert()
      setLoading(true)

      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData) as unknown as RegisterUser

      if (isValidRegisterData(data)) {
        const res = await AuthService.register(data)

        if (res?.error) {
          setLoading(false)
          return showError(res.message)
        } else if (res.user) {
          const { email, password } = data
          const resLogin = await AuthService.login(email, password)
          setLoading(false)

          if (resLogin?.error) {
            return showError(resLogin.message)
          }

          await dispatch(saveCurrentUser(resLogin.user))
          router.replace('/profile')
        }
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
        <meta name="description" content="Sign up our app" />
      </Head>

      <Container
        component="main"
        maxWidth="sm"
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenIcon />
          </Avatar>

          <Typography component="h1" variant="h5">{ title }</Typography>

          <RegisterForm
            showRegisterLink
            buttonLabel="Register"
            onSubmit={onSubmit}
            loading={loading}
          />
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

export default Register
