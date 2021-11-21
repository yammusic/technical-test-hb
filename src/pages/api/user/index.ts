import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User.model'
import { syncDB } from '../../../utils/connection'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, headers } = req
    await syncDB()

    if (method === 'POST') {
      const authorization = (headers.Authorization as string) || headers.authorization
      const authToken = authorization?.split(' ')[1] as string

      if (!authToken) {
        return res.status(400).json({
          error: 'missing_auth_token',
          message: 'Please provide an authorization token',
        })
      }

      const user = await User.findOne({ where: { authToken } })
      if (!user || !(await user.authorize())) {
        return res.status(401).json({
          error: 'unauthorized',
          message: 'User is not authorized',
        })
      }

      return res.status(200).json({
        message: 'Success',
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
