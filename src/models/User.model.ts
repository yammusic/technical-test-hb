import { Column, DataType, Model, Table } from 'sequelize-typescript'
import bcrypt from 'bcrypt'

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
    allowNull: false,
    type: DataType.TEXT,
  }) token!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  }) firstName!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
  }) lastName!: string

  // @HasMany(() => Repository)
  // repositories: Repository[]

  async isValid() {
    try {
      await this.validate()
      return this.email && this.password
    } catch (error) {
      console.warn("Error validating user", error)
      return false
    }
  }

  generateHash(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

  validPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}

export default User