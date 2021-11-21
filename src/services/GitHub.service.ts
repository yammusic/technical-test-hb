import APIService from './API.service'
import { encodeBase64 } from '../utils/crypto'
import { LoginUserResponse, RegisterUser, RegisterUserResponse } from '../types/user.types'
import { APIResponseError } from '../types/api.types'

class GitHubService extends APIService {
  baseUrl = 'https://api.github.com'

  async getUser(username: string) {
    try {
      return await this.request(`users/${username}`)
    } catch (error) {
      console.warn('Error in GitHubService -> getUser', error)
      return error
    }
  }

  async getRepositories(username: string) {
    try {
      return await this.get(`users/${username}/repos`)
    } catch (error) {
      console.warn('Error in GitHubService -> getRepositories', error)
      return error
    }
  }
}

export default new GitHubService()