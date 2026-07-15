import dotenv from "dotenv";
dotenv.config();

const requiredEnv = {
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  RESEND_EMAIL: process.env.RESEND_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default Object.freeze(requiredEnv);