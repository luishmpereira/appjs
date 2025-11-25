import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import type { Movement } from "./Movement";

export interface OperationAttributes {
  id: number;
  name: string;
  operationCode: string;
  operationType: "IN" | "OUT";
  changeInventory: boolean;
  hasFinance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperationCreationAttributes extends Optional<OperationAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Operation extends Model<OperationAttributes, OperationCreationAttributes> implements OperationAttributes {
  public id!: number;
  public name!: string;
  public operationCode!: string;
  public operationType!: "IN" | "OUT";
  public changeInventory!: boolean;
  public hasFinance!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly movements?: Movement[];

  static initModel(sequelize: Sequelize) {
    Operation.init(
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        operationCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        changeInventory: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        hasFinance: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        operationType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        
      },
      {
        sequelize,
        tableName: "operations",
        timestamps: true
      }
    );
    return Operation;
  }
}
