import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

import Link from './Link'

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
  showRegisterLink?: boolean
  showBackButton?: boolean
  requireGithubUsername?: boolean
  buttonLabel?: string
  hidePassword?: boolean
  values?: {
    email?: string
    firstName?: string
    lastName?: string
    githubUsername?: string
  }
}

const RegisterForm = (props: Props) => {
  const router = useRouter()
  const {
    onSubmit,
    loading,
    showRegisterLink,
    showBackButton,
    requireGithubUsername,
    buttonLabel,
    hidePassword,
    values,
  } = props

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            defaultValue={values?.firstName}
            autoFocus
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            defaultValue={values?.lastName}
            autoComplete="family-name"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
            defaultValue={values?.email}
            autoComplete="email"
          />
        </Grid>

        { !hidePassword && (
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
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            required={requireGithubUsername}
            id="githubUsername"
            label={ `GitHub username${!requireGithubUsername ? ' (optional)' : ''}` }
            name="githubUsername"
            defaultValue={values?.githubUsername}
          />
        </Grid>
      </Grid>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        { loading ? 'Please wait...' : ( buttonLabel || 'Register') }
      </Button>

      { showBackButton && (
        <Button
          fullWidth
          type="button"
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => router.back()}
        >
          Back
        </Button>
      )}

      { showRegisterLink && (
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default RegisterForm