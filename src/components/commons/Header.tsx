import React from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Link from './Link'
import { logout } from '../../store/actions/user'

type Props = {
  title?: string
  userLogged?: boolean
}

const Header = (props: Props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { title, userLogged } = props

  const onLogout = () => {
    dispatch(logout())
    router.replace('/')
  }

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      color="primary"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          { title || 'Application name' }
        </Typography>

        {/* <nav>
          <Link
            variant="button"
            color="text.primary"
            href="#"
            sx={{ my: 1, mx: 1.5 }}
          >
            Features
          </Link>
        </nav> */}

        { userLogged && (
          <Button variant="contained" color="error" onClick={onLogout}>
            Sign out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header