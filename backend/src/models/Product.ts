import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from "sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  image?: string;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "description" | "stockQuantity" | "minStockLevel" | "image"> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public stockQuantity!: number;
  public minStockLevel!: number;
  public image?: string;

  static initModel(sequelize: Sequelize) {
    Product.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        stockQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        minStockLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "products",
      }
    );
    return Product;
  }
}
