import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { MovementLine } from "./MovementLine";
import type { Operation } from "./Operation";
import { User } from "./User";

export interface MovementAttributes {
  id: number;
  stockMovementCode: string;
  movementDate: Date;
  movementType: "IN" | "OUT";
  status: "DRAFT" | "CONFIRMED";
  operationId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovementCreationAttributes extends Optional<MovementAttributes, "id"> {}

export class Movement 
    extends Model<MovementAttributes, MovementCreationAttributes>
    implements MovementAttributes {
  public id!: number;
  public stockMovementCode!: string;
  public movementDate!: Date;
  public movementType!: "IN" | "OUT";
  public status!: "DRAFT" | "CONFIRMED";
  public operationId!: number;
  public createdBy!: number;
  public updatedBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly lines?: MovementLine[];
  public readonly operation?: Operation;
  public readonly creator?: User;
  public readonly updater?: User;

  static initModel(sequelize: Sequelize) {
    return Movement.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        stockMovementCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        movementDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        movementType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "CONFIRMED",
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        operationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "movements",
      }
    );
  }
}
