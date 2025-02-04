import { Sequelize } from "sequelize";
import { User } from "../models/User";
import "dotenv/config";

// passing connnectino string to sequelize
const sequelize = new Sequelize(process.env.DIRECT_URL as string, {
    dialect: "postgres",
    logging: false,
});

User.initModel(sequelize);

export default sequelize;
