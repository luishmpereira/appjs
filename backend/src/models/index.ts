// import { sequelize } from "../config/database";
// import { User } from "./User";
// import { Role } from "./Role";
// import { Product } from "./Product";
// import { MovementLine } from "./MovementLine";
// import { Movement } from "./Movement";
// import { Operation } from "./Operation";

// User.initModel(sequelize);
// Role.initModel(sequelize);
// Product.initModel(sequelize);
// Movement.initModel(sequelize);
// MovementLine.initModel(sequelize);
// Operation.initModel(sequelize);

// Role.hasMany(User, { foreignKey: "roleId", as: "users" });
// User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// Product.hasMany(MovementLine, { foreignKey: "productId", as: "movements" });
// MovementLine.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User.hasMany(Movement, { foreignKey: "createdBy", as: "movements" });
// Movement.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// User.hasMany(Movement, { foreignKey: "updatedBy", as: "updatedMovements" });
// Movement.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });

// Movement.hasMany(MovementLine, { foreignKey: "movementId", as: "lines" });
// MovementLine.belongsTo(Movement, { foreignKey: "movementId", as: "movement" });

// Operation.hasMany(Movement, { foreignKey: "operationId", as: "movements" });
// Movement.belongsTo(Operation, { foreignKey: "operationId", as: "operation" });

// export { sequelize, User, Role, Product, Movement, MovementLine, Operation };
