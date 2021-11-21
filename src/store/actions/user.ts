import { Dispatch } from 'react'
import { RootStateOrAny } from 'react-redux'
import { createAction } from 'redux-actions'
import Favorite from '../../models/Favorite.model'

import GitHubService from '../../services/GitHub.service'
import UserService from '../../services/User.service'
import { UserRepository } from '../../types/user.types'

export const saveCurrentUser = createAction('user/SAVE_CURRENT_USER')
export const saveRepositories = createAction('user/SAVE_REPOSITORIES')
export const saveFavorites = createAction('user/SAVE_FAVORITES')

export const logout = () =>
  async (dispatch: Dispatch<any>) => {
    try {
      await dispatch(saveCurrentUser(null))
      await dispatch(saveRepositories([]))
      await dispatch(saveFavorites([]))
    } catch (error) {
      console.warn(error)
    }
  }

// export const getFavorites = () =>
//   async (dispatch: Dispatch<any>, getState: () => RootStateOrAny) => {
//     try {
//       const { currentUser } = getState().user
//       if (!currentUser) { return }
//       const favorites = await UserService.getFavorites(currentUser.username)
//       dispatch(saveFavorites(favorites))
//     } catch (error) {
//       console.warn(error)
//     }
//   }

export const getRepositories = () =>
  async (dispatch: Dispatch<any>, getState: () => RootStateOrAny) => {
    try {
      const {
        app: { apiBaseUrl },
        user: { currentUser },
      } = getState()
      if (!apiBaseUrl || !currentUser || !currentUser.githubUsername) return
      UserService.baseUrl = apiBaseUrl
      UserService.authToken = currentUser.authToken

      const { favorites } = await UserService.getFavorites(currentUser.id)
      const repositories = await GitHubService.getRepositories(currentUser.githubUsername)

      if (!Array.isArray(repositories)) {
        await dispatch(saveRepositories([]))
        throw repositories.message
      }

      const newRepositories = repositories.map((r: UserRepository) => {
        if (favorites.find((f: Favorite) => f.repoId === r.id)) {
          r.favorite = true
        }
        return r
      })
      await dispatch(saveFavorites(favorites))
      await dispatch(saveRepositories(newRepositories))
    } catch (error) {
      console.warn(error)
    }
  }

export const addFavorite = (repoId: number) =>
  async (dispatch: Dispatch<any>, getState: () => RootStateOrAny) => {
    try {
      const {
        app: { apiBaseUrl },
        user: { currentUser, repositories },
      } = getState()
      if (!apiBaseUrl || !currentUser || !currentUser.githubUsername) return
      UserService.baseUrl = apiBaseUrl
      UserService.authToken = currentUser.authToken

      const { favorites } = await UserService.addFavorite(currentUser.id, repoId)

      const newRepositories = [...repositories].map((r: UserRepository|any) => {
        r.favorite = false
        if (favorites.find((f: Favorite) => f.repoId === r.id)) {
          r.favorite = true
        }
        return r
      })

      console.log('newFavorite', favorites)
      console.log('newRepository', repositories, newRepositories)

      await dispatch(saveFavorites(favorites))
      await dispatch(saveRepositories(newRepositories))
    } catch (error) {
      console.warn(error)
    }
  }

  export const removeFavorite = (repoId: number) =>
  async (dispatch: Dispatch<any>, getState: () => RootStateOrAny) => {
    try {
      const {
        app: { apiBaseUrl },
        user: { currentUser, favorites, repositories },
      } = getState()
      if (!apiBaseUrl || !currentUser || !currentUser.githubUsername) return
      UserService.baseUrl = apiBaseUrl
      UserService.authToken = currentUser.authToken

      const favorite = favorites.find((f: Favorite) => f.repoId === repoId)
      const { favorites: newFavorites } = await UserService.removeFavorite(currentUser.id, favorite.id)

      const newRepositories = [...repositories].map((r: UserRepository|any) => {
        r.favorite = false
        if (newFavorites.find((f: Favorite) => f.repoId === r.id)) {
          r.favorite = true
        }
        return r
      })

      console.log('newFavorites', favorites, newFavorites)
      console.log('newRepository', repositories, newRepositories)

      await dispatch(saveFavorites(newFavorites))
      await dispatch(saveRepositories(newRepositories))
    } catch (error) {
      console.warn(error)
    }
  }