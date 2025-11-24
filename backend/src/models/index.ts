import { sequelize } from "../config/database";
import { User } from "./User";

User.initModel(sequelize);

export { sequelize, User };
