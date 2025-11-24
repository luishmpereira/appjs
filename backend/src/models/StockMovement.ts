import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from "sequelize";
import { Product } from "./Product";
import { User } from "./User";

export interface StockMovementAttributes {
  id: number;
  productId: number;
  type: "IN" | "OUT";
  quantity: number;
  reason?: string;
  userId: number;
}

export interface StockMovementCreationAttributes
  extends Optional<StockMovementAttributes, "id" | "reason"> {}

export class StockMovement
  extends Model<StockMovementAttributes, StockMovementCreationAttributes>
  implements StockMovementAttributes
{
  public id!: number;
  public productId!: number;
  public type!: "IN" | "OUT";
  public quantity!: number;
  public reason?: string;
  public userId!: number;

  static initModel(sequelize: Sequelize) {
    StockMovement.init(
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
        type: {
          type: DataTypes.ENUM("IN", "OUT"),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "stock_movements",
      }
    );
    return StockMovement;
  }
}
