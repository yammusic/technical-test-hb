import type { NextApiRequest, NextApiResponse } from 'next'
import { syncDB } from '../../utils/connection'
import User from '../../models/User.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req
    await syncDB()

    if (method === 'POST') {
      const { email, password, firstName, lastName } = req.body

      const userExists = await User.findOne({ where: { email } })
      if (userExists) {
        return res.status(400).json('User already exists')
      }

      const user = User.build({
        email,
        password,
        firstName,
        lastName,
      })

      await user.validate()
      await user.save()

      return res.status(200).json({
        message: 'Register Success!',
        user,
      })
    }

    return res.status(405).json('Method not allowed')
  } catch (error: Error | any) {
    const message = (error.message || error) ?? 'Something went wrong'
    return res.status(500).json(message)
  }
}
