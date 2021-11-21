import { randomBytes } from 'crypto'
import CryptoJS from 'crypto-js'

export const generateSecretKey = (options?: any): string => {
  const length = options?.length ?? 32
  return randomBytes(length).toString('hex')
}

export const encodeBase64 = (data: string): string => {
  const encodedWord = CryptoJS.enc.Utf8.parse(data)
  return encodedWord.toString(CryptoJS.enc.Base64)
}

export const decodeBase64 = (data: string): string => {
  const decodedWord = CryptoJS.enc.Base64.parse(data)
  return decodedWord.toString(CryptoJS.enc.Utf8)
}