import { register } from './register'
import { getById } from "./get-by-id";
import { getByTitle } from './get-by-title';
import { registerAttendeeInEvent } from "./register-attendee-in-event";

export const eventsRouter = {
  register,
  getById,
  getByTitle,
  registerAttendeeInEvent
}