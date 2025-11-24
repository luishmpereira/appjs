import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from "sequelize";
import bcrypt from "bcryptjs";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "user" | "admin";

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
        role: {
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user",
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
