export interface Session {
  user: {
    id: number
    email: string
  }
  issued: number
  expires: number
}

export type PartialSession = Omit<Session, 'issued' | 'expires'>

export interface EncodeResult {
  token: string,
  expires: number,
  issued: number
}

export type DecodeResult = {
  type: 'valid' | 'integrity-error' | 'invalid-token'
  session?: Session
}

export type ExpirationStatus = 'expired' | 'active' | 'grace'