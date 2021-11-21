import { handleActions } from 'redux-actions'
import * as actions from '../actions/user'

const initialState = {
  currentUser: null,
  repositories: [],
  favorites: [],
}

export default handleActions({
  [actions.saveCurrentUser as any]: (state, action): any => {
    let currentUser = null
    if (action.payload) {
      currentUser = action.payload
    }
    return { ...state, currentUser }
  },

  [actions.saveRepositories as any]: (state, { payload }): any => {
    let repositories: any = []
    if (payload) { repositories = payload }
    return { ...state, repositories }
  },

  [actions.saveFavorites as any]: (state, { payload }): any => {
    let favorites: any = []
    if (payload) { favorites = payload }
    return { ...state, favorites }
  },
}, initialState)
