import { handleActions } from 'redux-actions'
import * as actions from '../actions/app'

const initialState = {
  apiBaseUrl: 'http://localhost:3000/api',
}

export default handleActions({
  [actions.saveApiBaseUri as any]: (state, { payload }): any => {
    let apiBaseUrl: any = initialState.apiBaseUrl
    if (payload) { apiBaseUrl = payload }
    return { ...state, apiBaseUrl }
  },
}, initialState)
