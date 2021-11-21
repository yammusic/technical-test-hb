import { LoginUser, RegisterUser } from '../../types/user.types'

export const isValidRegisterData = (user: RegisterUser | any) => {
  if (!user) return false
  const fieldsToValid = ['email', 'password', 'firstName', 'lastName']
  if (user.githubUsername) fieldsToValid.push('githubUsername')
  return fieldsToValid.every(field => (user[field] && user[field].length > 0))
}

export const isValidLoginData = (user: LoginUser | any) => {
  if (!user) return false
  const fieldsToValid = ['email', 'password']
  if (user.rememberMe) fieldsToValid.push('rememberMe')
  return fieldsToValid.every(field => (user[field] && user[field].length > 0))
}