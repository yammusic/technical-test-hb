import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User.model'
import { syncDB } from '../../../utils/connection'
import { isValidRegisterData } from '../../../utils/validators/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, body } = req
    await syncDB()

    if (method === 'POST') {
      const data = body
      const { email } = data

      if (!isValidRegisterData(data)) {
        return res.status(400).json({
          error: 'missing_required_fields',
          message: 'Please fill all the fields',
        })
      }

      const userExists = await User.findOne({ where: { email } })
      if (userExists) {
        return res.status(400).json({
          error: 'user_exists',
          message: 'User already exists',
        })
      }

      const user = User.build(data)

      await user.validate()
      await user.save()

      return res.status(201).json({
        message: 'Register Success!',
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
