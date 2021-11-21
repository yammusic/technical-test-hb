import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import type { NextPage } from 'next'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { diff } from 'deep-object-diff'

import Header from '../../components/commons/Header'
import ProfileDetail from '../../components/commons/ProfileDetail'
import RegisterForm from '../../components/commons/RegisterForm'
import UserService from '../../services/User.service'
import { logout, saveCurrentUser, saveRepositories } from '../../store/actions/user'

const ProfileEdit: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const state: RootStateOrAny = useSelector((state) => state)
  const {
    app: { apiBaseUrl },
    user: { currentUser, repositories, favorites },
  } = state

  UserService.baseUrl = apiBaseUrl
  UserService.authToken = currentUser?.authToken

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const [title, setTitle] = useState('Edit Profile')
  const userFullName = `${currentUser?.firstName} ${currentUser?.lastName}`

  useEffect(() => {
    if (!currentUser) {
      router.replace('/')
      return
    }
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      setLoading(true)

      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData)

      if (Object.keys(data).length > 0) {
        const newData: any = diff(currentUser, data)
        Object.keys(newData).forEach(key => !newData[key] && delete newData[key])
        const res = await UserService.update(currentUser.id, newData)

        if (res?.error) {
          setLoading(false)
          if (res.error === 'unauthorized') {
            await dispatch(logout())
            return router.replace('/')
          }
          return showError(res.message)
        }

        await dispatch(saveCurrentUser(res.user))
        await dispatch(saveRepositories([]))
        setLoading(false)
        return router.replace('/profile')
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
        <meta name="description" content="Edit profile user" />
      </Head>

      <Header userLogged={currentUser} />

      <Container
        component="main"
        sx={{
          maxWidth: '100% !important',
          padding: '0 !important',
          display: 'flex',
          flex: 1,
          marginTop: '64px',
        }}
      >
        <Grid container
          sx={{
            flex: 1,
          }}
        >
          {/* Left content */}
          <Grid item xs={12} md={3}
            sx={{
              pl: 2,
              pr: 2,
              pt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ProfileDetail
              userFullName={userFullName}
              githubUsername={currentUser?.githubUsername}
              repositoriesCount={repositories?.length}
              favoritesCount={favorites?.length}
            />
          </Grid>

          {/* Right content */}
          <Grid item xs={12} md={9}
            sx={{
              marginLeft: '-1px',
              borderLeft: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Toolbar
              sx={{
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                mt: { xs: 2, md: 0 },
                p: { xs: 2, md: 0 },
                pl: { xs: 0, md: 2 },
                pr: { xs: 0, md: 2 },
                borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
              }}>
              <Typography
                noWrap
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { sm: 'block' } }}
              >
                Edit profile
              </Typography>
            </Toolbar>

            <Grid container
              sx={{
                mt: { md: 3, xs: 0, sm: 0 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Grid item xs={12} sm={12} md={10}
                sx={{
                  pl: 2,
                  pr: 2,
                  mb: 2,
                  flex: 0,
                  display: 'flex',
                }}
              >
                <RegisterForm
                  hidePassword
                  showBackButton
                  requireGithubUsername
                  buttonLabel="Save"
                  onSubmit={onSubmit}
                  loading={loading}
                  values={{
                    firstName: currentUser?.firstName,
                    lastName: currentUser?.lastName,
                    email: currentUser?.email,
                    githubUsername: currentUser?.githubUsername,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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

export default ProfileEdit
