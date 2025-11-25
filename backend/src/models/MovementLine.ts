import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from "sequelize";
import { Product } from "./Product";
import { Movement } from "./Movement";

export interface MovementLineAttributes {
  id: number;
  productId: number;
  quantity: number;
  movementId: number;
}

export interface MovementLineCreationAttributes
  extends Optional<MovementLineAttributes, "id"> {}

export class MovementLine
  extends Model<MovementLineAttributes, MovementLineCreationAttributes>
  implements MovementLineAttributes
{
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public movementId!: number;

  public readonly product?: Product;
  public readonly movement?: Movement;

  static initModel(sequelize: Sequelize) {
    MovementLine.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        movementId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "movements",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "movement_lines",
        timestamps: false,
      }
    );
    return MovementLine;
  }
}
