import { Sequelize } from "sequelize";
import pg from "pg";
import config from "../sequelize.config";

// Environment configuration
const dbConfig = config["development"];

const sequelize = new Sequelize(
  dbConfig.database ?? "",
  dbConfig.username ?? "",
  dbConfig.password ?? "",
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectModule: pg,
    dialectOptions: dbConfig.dialectOptions,
    logging: false,
  }
);

export { sequelize };

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully.");
  } catch (err: any) {
    console.log("Database connection error:", err.message);
  }
};
