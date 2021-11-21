import { BeforeValidate, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { generateSecretKey } from '../utils/crypto'
import { checkExpirationStatus, decodeSession, encodeSession } from '../utils/jwt'
import { Session } from '../types/jwt.types'
import Favorite from './Favorite.model'

@Table({ timestamps: true })
class User extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email must be a valid email address'
      },
    },
  }) email!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  get password(): string {
    return this.getDataValue('password')
  }

  set password(value: string) {
    this.setDataValue('password', this.generateHash(value))
  }

  @Column({
    type: DataType.TEXT,
  }) authToken!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  }) firstName!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  }) lastName!: string

  @Column({
    type: DataType.STRING,
  }) githubUsername!: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    unique: true,
  }) secretKey!: string

  @HasMany(() => Favorite)
  favorites?: Favorite[]

  @BeforeValidate
  static addSecretKey(user: User) {
    if (!user.secretKey) {
      user.secretKey = generateSecretKey()
    }
  }

  async sync() {
    this.favorites = await Favorite.findAll({  where: { userId: this.id } }) || []
  }

  generateHash(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

  validPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }

  async createSession(session?: Session) {
    const { token } = encodeSession(this.secretKey, session || {
      user: {
        id: this.id,
        email: this.email,
      },
    })

    this.authToken = token
    await this.save()
  }

  isValidToken() {
    if (!this.authToken) return false
    const { type } = decodeSession(this.secretKey, this.authToken)
    return !(type === 'integrity-error' || type === 'invalid-token')
  }

  isSessionExpired() {
    if (!this.isValidToken()) return true
    const session = this.getSession()
    if (!session) return true
    const expiration = checkExpirationStatus(session)
    return expiration === 'expired'
  }

  getSession(): Session {
    if (!this.isValidToken()) return undefined as any
    const { session } = decodeSession(this.secretKey, this.authToken)
    return session as Session
  }

  async authorize() {
    if (!this.authToken) await this.createSession()
    if (!this.isValidToken() || this.isSessionExpired()) return false

    const expiration = checkExpirationStatus(this.getSession())
    let session: Session

    if (expiration === 'grace') {
      const { token, expires, issued } = encodeSession(this.secretKey, this.getSession())
      session = {
        ...this.getSession(),
        expires: expires,
        issued: issued
      }

      this.authToken = token
    } else {
      session = this.getSession()
    }

    if (session.user.id !== this.id) {
      return false
    }

    return true
  }

  toJSON() {
    const values = Object.assign({}, this.get())
    delete values.password
    delete values.secretKey
    return values
  }
}

export default User