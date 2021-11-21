import User from '../models/User.model'

export type RegisterUser = {
  email: string
  password: string
  firstName: string
  lastName: string
  githubUsername?: string
}

export type LoginUser = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterUserResponse = {
  user: User
  message: string
}

export type LoginUserResponse = {
  user: User
  message: string
}

export type UserRepository = {
  id: number
  name: string
  html_url: string
  description: string
  language: string
  favorite?: boolean
}
