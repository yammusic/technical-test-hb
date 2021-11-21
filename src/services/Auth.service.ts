import APIService from './API.service'
import { encodeBase64 } from '../utils/crypto'
import { LoginUserResponse, RegisterUser, RegisterUserResponse } from '../types/user.types'
import { APIResponseError } from '../types/api.types'

class AuthService extends APIService {
  async login(email: string, password: string): Promise<LoginUserResponse & APIResponseError> {
    return await this.post('/auth/login', null, {
      headers: { 'Authorization': `Basic ${encodeBase64(`${email}:${password}`)}` }
    })
  }

  async register(user: RegisterUser): Promise<RegisterUserResponse & APIResponseError> {
    return await this.post('/auth/register', { ...user })
  }
}

export default new AuthService()