import {
  Model,
  DataTypes,
  Optional,
  Sequelize,
  HasManyGetAssociationsMixin,
} from "sequelize";

export interface RoleAttributes {
  id: number;
  name: string;
  permissions: any; // JSON storage for CASL rules
}

export interface RoleCreationAttributes
  extends Optional<RoleAttributes, "id"> {}

export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public permissions!: any;

  static initModel(sequelize: Sequelize) {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        permissions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
      },
      {
        sequelize,
        tableName: "roles",
      }
    );
    return Role;
  }
}
