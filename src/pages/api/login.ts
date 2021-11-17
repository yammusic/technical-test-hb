import type { NextApiRequest, NextApiResponse } from 'next'
import { syncDB } from '../../utils/connection'
import User from '../../models/User.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req
    await syncDB()

    if (method === 'POST') {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json('Email and password required')
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json('User not found')
      }

      if (!user.validPassword(password)) {
        return res.status(400).json('Incorrect password')
      }

      return res.status(200).json({
        message: 'Login Success!',
        user,
      })
    }

    return res.status(405).json('Method not allowed')
  } catch (error: Error | any) {
    const message = (error.message ?? error) || 'Something went wrong'
    return res.status(500).json(message)
  }
}
