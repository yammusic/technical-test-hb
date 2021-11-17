import { Sequelize } from 'sequelize-typescript'

import User from '../models/User.model'

let db: Sequelize | null = null

if (!db) {
  db = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite3',
    logging: console.log,
  })

  db.addModels([
    User,
  ])
}

export const connectDB = async () => {
  try {
    await db?.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.warn("Error connecting to database", error)
  }
}

export const syncDB = async () => {
  try {
    await db?.sync()
    console.log('Database synced successfully.')
  } catch (error) {
    console.warn("Error syncing database", error)
  }
}

export const closeDB = async () => {
  try {
    await db?.close()
    console.log('Connection has been closed successfully.')
  } catch (error) {
    console.warn("Error closing database", error)
  }
}

export default db as Sequelize