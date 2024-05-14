import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

export const SERVER = {
  PORT: Number(process.env.SERVER_PORT)
}

export const LOG_ERROR = {
  FILE_LOG: path.resolve(process.cwd(), 'logs', 'error.log'),
  DIR_LOGS: path.resolve(process.cwd(), 'logs')
}

export const JWT_CONFIG = {
  SECRET_KEY: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN
}

export const DB = {
  USER: process.env.POSTGRES_USER,
  PASS: process.env.POSTGRES_PASSWORD,
  HOST: process.env.POSTGRES_HOST,
  PORT: Number(process.env.POSTGRES_PORT),
  DB_NAME: process.env.POSTGRES_DATABASE
}