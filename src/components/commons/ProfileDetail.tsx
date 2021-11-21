import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from './Link'

type Props = {
  userFullName: string
  githubUsername?: string
  repositoriesCount?: number
  favoritesCount?: number
  showEditButton?: boolean
}

const ProfileDetail = (props: Props) => {
  const {
    userFullName,
    githubUsername,
    repositoriesCount,
    favoritesCount,
    showEditButton,
  } = props
  const avatarSize = 180

  return (
    <>
      <Avatar
        alt={ userFullName }
        src="/default-avatar.png"
        sx={{
          mb: 2,
          width: avatarSize,
          height: avatarSize,
        }}
      />

      <Typography gutterBottom variant="h6" align="center">
        { userFullName }
      </Typography>

      { githubUsername && (
        <Typography variant="subtitle1" align="center">
          <strong>GitHub User: </strong>
          { githubUsername }
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
          mb: 3,
        }}
      >
        <Typography variant="body1" align="center">
          { repositoriesCount || 0 } Repositories
        </Typography>

        <Typography variant="body1" align="center">
          { favoritesCount || 0 } Favorites
        </Typography>
      </Box>

      { showEditButton && (
        <Link href="/profile/edit" noLinkStyle>
          <Button variant="contained" color="info">Edit User</Button>
        </Link>
      )}
    </>
  )
}

export default ProfileDetail