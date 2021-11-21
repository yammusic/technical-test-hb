import type { NextApiRequest, NextApiResponse } from 'next'
import Favorite from '../../../../../models/Favorite.model'
import User from '../../../../../models/User.model'
import { syncDB } from '../../../../../utils/connection'

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

    switch (method) {
      case 'POST': {
        const { repoId } = body

        const favoriteExists = await Favorite.findOne({
          where: {
            userId: user.id,
            githubUsername: user.githubUsername,
            repoId,
          },
        })

        if (!favoriteExists) {
          await Favorite.create({
            userId: user.id,
            githubUsername: user.githubUsername,
            repoId,
          })
        }

        await user.sync()
        const favorites = user.favorites?.filter((f) => f.githubUsername === user.githubUsername )

        return res.status(201).json({
          message: 'Favorite created successfully',
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
