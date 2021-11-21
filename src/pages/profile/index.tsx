import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import SyncIcon from '@mui/icons-material/Sync'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAlphaDown } from '@fortawesome/free-solid-svg-icons/faSortAlphaDown'
import { faSortAlphaUp } from '@fortawesome/free-solid-svg-icons/faSortAlphaUp'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import Head from 'next/head'
import type { NextPage } from 'next'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import Header from '../../components/commons/Header'
import Link from '../../components/commons/Link'
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/commons/Search'
import { addFavorite, getRepositories, removeFavorite } from '../../store/actions/user'
import { UserRepository } from '../../types/user.types'
import ProfileDetail from '../../components/commons/ProfileDetail'

const Profile: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const state: RootStateOrAny = useSelector((state) => state)
  const { user: { currentUser, repositories, favorites } } = state
  const [reposFiltered, setReposFiltered] = useState<null | UserRepository[]>(null)
  const [loading, setLoading] = useState(false)
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null)
  const openFilterMenu = Boolean(filterEl)

  const [title, setTitle] = useState('Profile')
  const userFullName = `${currentUser?.firstName} ${currentUser?.lastName}`

  console.info('Profile: ', state)

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        router.replace('/')
        return
      }

      console.info('Fetching repositories...', repositories)
      if (!repositories || repositories.length === 0) {
        await syncRepositories()
      }
    })()
  }, [])

  const syncRepositories = async () => {
    setLoading(true)
    await dispatch(getRepositories())
    setLoading(false)
  }

  const showFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterEl(event.currentTarget)
  }

  const closeFilterMenu = () => {
    setFilterEl(null)
  }

  const handleFilter = (type: string) => {
    let filtered = null

    if (type === 'asc') {
      filtered = repositories.sort((a: UserRepository, b: UserRepository) => a.name.localeCompare(b.name))
    } else if (type === 'desc') {
      filtered = repositories.sort((a: UserRepository, b: UserRepository) => b.name.localeCompare(a.name))
    } else if (type === 'fav') {
      filtered = repositories.filter((repo: UserRepository) => repo.favorite)
    }

    setReposFiltered(filtered)
    closeFilterMenu()
  }

  const addToFavorites = async (repo: UserRepository) => {
    await dispatch(addFavorite(repo.id))
    setLoading(false)
  }

  const removeFromFavorites = async (repo: UserRepository) => {
    await dispatch(removeFavorite(repo.id))
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content="Profile user" />
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
              showEditButton
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
                Repositories
              </Typography>

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>

                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => {
                    const value = e.target.value
                    setReposFiltered(value ?
                      repositories.filter((repo: any) =>
                        repo.name.toLowerCase().includes(value.toLowerCase()
                      ))
                    : null)
                  }}
                />
              </Search>
            </Toolbar>

            <Grid container
              sx={{
                m: 0,
                mt: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Grid item xs={12}
                sx={{
                  pl: 2,
                  pr: 2,
                  mb: 2,
                  flex: 0,
                  display: 'flex',
                  alignItems: 'center',

                }}
              >
                <Typography variant="subtitle2" sx={{ flex: 1 }}>
                  { !loading && `Total ${(reposFiltered || repositories)?.length} repositories` }
                </Typography>

                <Box>
                  <Tooltip title="Filter">
                    <IconButton
                      aria-label="filter"
                      onClick={showFilterMenu}
                    >
                      <FilterAltIcon />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    id="filterMenu"
                    anchorEl={filterEl}
                    open={openFilterMenu}
                    onClose={closeFilterMenu}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => handleFilter('asc')}>
                      <ListItemIcon>
                        <FontAwesomeIcon icon={faSortAlphaDown} />
                      </ListItemIcon>
                      <ListItemText>Asc</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleFilter('desc')}>
                      <ListItemIcon>
                        <FontAwesomeIcon icon={faSortAlphaUp} />
                      </ListItemIcon>
                      <ListItemText>Desc</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleFilter('fav')}>
                      <ListItemIcon>
                        <FontAwesomeIcon icon={faHeart} />
                      </ListItemIcon>
                      <ListItemText>Favorites</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>

                <Tooltip title="Sync repositories">
                  <IconButton
                    color="primary"
                    component="span"
                    onClick={syncRepositories}
                    disabled={loading}
                  >
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Loading container */}
              { loading && (
                <Grid item xs={12}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <CircularProgress />

                  <Typography variant="body1" align="center" sx={{ mt: 3 }}>
                    Loading...
                  </Typography>
                </Grid>
              ) }

              {/* No repositories found */}
              { (!(reposFiltered || repositories)?.length && !loading) && (
                <Grid item xs={12}
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: -5,
                  }}
                >
                  <Typography variant="h6" align="center">
                    No repositories found
                  </Typography>

                  <Typography variant="body1" align="center">
                    You must create a new repository in GitHub to be able to see it here.
                  </Typography>
                </Grid>
              )}

              {/* Repositories list */}
              { ((reposFiltered || repositories)?.length > 0 && !loading) && (
                <Grid container>
                  { (reposFiltered || repositories)?.map((repo: UserRepository) => (
                    <Grid item key={`repo_${repo.id}`} xs={12} sm={6} md={4}
                      sx={{
                        padding: 2,
                        flex: 1,
                        display: 'inline-flex',
                        minHeight: '160px',
                      }}
                    >
                      <Card
                        sx={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'column',
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            { repo.name }
                          </Typography>

                          { repo.description && (
                            <Typography gutterBottom variant="body1" sx={{ fontSize: 14 }}>
                              { repo.description }
                            </Typography>
                          )}

                          <Box>
                            <Tooltip title="View in GitHub">
                              <IconButton href={ repo.html_url } target="_blank">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip
                              title={
                                repo.favorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                              }
                            >
                              <IconButton onClick={
                                repo.favorite
                                ? () => removeFromFavorites(repo)
                                : () => addToFavorites(repo)
                              }>
                                { repo.favorite && <FavoriteIcon color="error" /> }
                                { !repo.favorite && <FavoriteBorderIcon /> }
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Profile
