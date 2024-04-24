import dotenv from "dotenv";

dotenv.config();

export const SERVER = {
  PORT: Number(process.env.SERVER_PORT)
}