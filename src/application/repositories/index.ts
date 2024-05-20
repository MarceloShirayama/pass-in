import { CheckInRepository } from "./check-in-repository"
import { EventRepository } from "./event-repository"
import { EventUserRepository } from "./event-user-repository"
import { UserRepository } from "./user-repository"

type Repositories = {
  eventRepository: EventRepository
  eventUserRepository: EventUserRepository
  userRepository: UserRepository
  checkInRepository: CheckInRepository
}

export {
  EventRepository,
  EventUserRepository,
  UserRepository,
  CheckInRepository,
  Repositories
}