import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User.model'
import { syncDB } from '../../../utils/connection'
import { decodeBase64 } from '../../../utils/crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, headers } = req
    await syncDB()

    if (method === 'POST') {
      const authorization = (headers.Authorization as string) || headers.authorization
      const basicAuth = authorization?.split(' ')[1] as string
      const [email, password] = decodeBase64(basicAuth).split(':')

      if (!email || !password) {
        return res.status(400).json({
          error: 'missing_required_fields',
          message: 'Email and password required',
        })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({
          error: 'not_found',
          message: 'User not found',
        })
      }

      if (!user.validPassword(password)) {
        return res.status(400).json({
          error: 'invalid_password',
          message: 'Incorrect password',
        })
      }

      if (user.isSessionExpired()) {
        await user.createSession()
      }

      if (!(await user.authorize())) {
        return res.status(401).json({
          error: 'unauthorized',
          message: 'User is not authorized',
        })
      }

      return res.status(200).json({
        message: 'Login Success!',
        user: user.toJSON(),
      })
    }

    return res.status(405).json({
      error: 'method_not_allowed',
      message: 'Method not allowed',
    })
  } catch (error: Error | any) {
    const message = (error.message || error) ?? 'Something went wrong'
    return res.status(500).json({
      error: 'unexpected_error',
      message,
    })
  }
}
