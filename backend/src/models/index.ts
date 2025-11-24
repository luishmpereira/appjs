import { sequelize } from "../config/database";
import { User } from "./User";
import { Role } from "./Role";
import { Product } from "./Product";
import { StockMovement } from "./StockMovement";

User.initModel(sequelize);
Role.initModel(sequelize);
Product.initModel(sequelize);
StockMovement.initModel(sequelize);

Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

Product.hasMany(StockMovement, { foreignKey: "productId", as: "movements" });
StockMovement.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(StockMovement, { foreignKey: "userId", as: "stockMovements" });
StockMovement.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Role, Product, StockMovement };
