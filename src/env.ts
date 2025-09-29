import "dotenv/config";

const envs = {
  DB_NAME: String(process.env.DB_NAME),
  DB_USER: String(process.env.DB_USER),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: Number(process.env.DB_PORT),
  PORT: Number(process.env.PORT),
};

export default envs;
