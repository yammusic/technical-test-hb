import type { NextApiRequest, NextApiResponse } from 'next'
import Favorite from '../../../../models/Favorite.model'
import User from '../../../../models/User.model'
import { syncDB } from '../../../../utils/connection'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method, headers, query, body } = req
    await syncDB()

    const authorization = (headers.Authorization as string) || headers.authorization
    const authToken = authorization?.split(' ')[1] as string
    const { userId: id } = query

    if (!authToken) {
      return res.status(400).json({
        error: 'missing_auth_token',
        message: 'Please provide an authorization token',
      })
    }

    const user = await User.findOne({
      where: { id, authToken },
      include: [Favorite],
    })
    if (!user || !(await user.authorize())) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'User is not authorized',
      })
    }

    const favorites = user.favorites?.filter((favorite) => favorite.githubUsername === user.githubUsername)
    console.info(user.favorites, favorites)

    switch (method) {
      case 'GET': {
        return res.status(200).json({
          message: 'Getting favorites successfully',
          favorites: favorites || [],
        })
      }

      default: {
        return res.status(405).json({
          error: 'method_not_allowed',
          message: 'Method not allowed',
        })
      }
    }
  } catch (error: Error | any) {
    const message = (error.message || error) ?? 'Something went wrong'
    return res.status(500).json({
      error: 'unexpected_error',
      message,
    })
  }
}
