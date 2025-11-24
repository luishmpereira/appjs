import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from "sequelize";
import bcrypt from "bcryptjs";
import { Role } from "./Role";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId?: number;
  avatar?: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "roleId" | "avatar"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public avatar?: string;
  public roleId!: number;
  public role?: Role;

  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "roles",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "users",
        hooks: {
          beforeCreate: async (user: User) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          },
        },
      }
    );

    return User;
  }
}
