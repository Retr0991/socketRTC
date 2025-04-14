import { Model, Table, Column, DataType, Index, Sequelize } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false, underscored: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: Sequelize.literal("nextval('users_id_seq'::regclass)"),
  })
  @Index({ name: 'users_pkey', using: 'BTREE', unique: true })
  declare id: number;

  @Column({ 
    type: DataType.STRING(50), 
    allowNull: false, 
    unique: true 
  })
  username!: string;

  @Column({ 
    type: DataType.TEXT, 
    allowNull: false,
    field: 'public_key',
  })
  publicKey!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("now()"),
  })
  created_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("now()"),
  })
  last_login!: Date;
}