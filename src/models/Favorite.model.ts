import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import User from './User.model'

@Table({ timestamps: true })
class Favorite extends Model {
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  }) userId!: number

  @Column({
    allowNull: false,
    type: DataType.STRING,
  }) githubUsername!: string

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  }) repoId!: number

  @BelongsTo(() => User)
  user!: User

  toJSON() {
    const values = Object.assign({}, this.get())
    return values
  }
}

export default Favorite