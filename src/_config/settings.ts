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