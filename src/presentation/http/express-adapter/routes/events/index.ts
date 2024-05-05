import { register } from './register'
import { getById } from "./get-by-id";
import { getByTitle } from './get-by-title';

export const eventsRouter = {
  register,
  getById,
  getByTitle
}