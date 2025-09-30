require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres",
    timezone: "+00:00",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: process.env.DB_USER_TEST || "root",
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_NAME_TEST || "database_test",
    host: process.env.DB_HOST_TEST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres",
    timezone: "+00:00",
  },
  production: {
    username: process.env.DB_USER_PRODUCTION || "root",
    password: process.env.DB_PASSWORD_PRODUCTION || null,
    database: process.env.DB_NAME_PRODUCTION || "database_production",
    host: process.env.DB_HOST_PRODUCTION || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres",
    timezone: "+00:00",
  },
};
