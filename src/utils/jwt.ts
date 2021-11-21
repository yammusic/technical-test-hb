import { encode, decode, TAlgorithm } from 'jwt-simple'
import { DecodeResult, EncodeResult, ExpirationStatus, PartialSession, Session } from '../types/jwt.types'

export const encodeSession = (secretKey: string, partialSession: PartialSession): EncodeResult => {
  const algorithm: TAlgorithm = 'HS512'
  const issued = Date.now()
  const sessionTime = 2 * 60 * 60 * 1000 // 2 hours
  const expires = issued + sessionTime
  const session: Session = {
    ...partialSession,
    issued: issued,
    expires: expires,
  }

  return {
    token: encode(session, secretKey, algorithm),
    issued: issued,
    expires: expires
  }
}

export const decodeSession = (secretKey: string, sessionToken: string): DecodeResult => {
  const algorithm: TAlgorithm = 'HS512'
  let result: Session

  try {
    result = decode(sessionToken, secretKey, false, algorithm)
  } catch (_e: any) {
    const e: Error = _e

    if (e?.message === 'No token supplied' || e?.message === 'Not enough or too many segments') {
      return { type: 'invalid-token' }
    }

    if (e?.message === 'Signature verification failed' || e?.message === 'Algorithm not supported') {
      return { type: 'integrity-error' }
    }

    if (e?.message.indexOf('Unexpected token') === 0) {
      return { type: 'invalid-token' }
    }

    throw e
  }

  return {
    type: 'valid',
    session: result,
  }
}

export const checkExpirationStatus = (session: Session): ExpirationStatus => {
  const now = Date.now()
  if (session.expires > now) return 'active'

  const gracePeriod = 30 * 60 * 1000 // 30 minutes
  const threeHoursAfterExpiration = session.expires + gracePeriod

  if (threeHoursAfterExpiration > now) return 'grace'
  return 'expired'
}