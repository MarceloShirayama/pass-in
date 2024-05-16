import {
  EventDatabaseRepository,
  inMemoryCheckInRepository,
  inMemoryEventRepository,
  inMemoryEventUserRepository,
  inMemoryUserRepository,
  UserDatabaseRepository
} from "@infra/repositories";
import { PostgresAdapter } from "@infra/database";
import {
  CheckInRepository,
  EventRepository,
  EventUserRepository,
  UserRepository
} from "@application/repositories";

export class RepositoriesFactory {
  static get inMemory() {
    return {
      eventRepository: inMemoryEventRepository,
      eventUserRepository: inMemoryEventUserRepository,
      userRepository: inMemoryUserRepository,
      checkInRepository: inMemoryCheckInRepository
    }
  }

  static get database() {
    const connection = new PostgresAdapter()
    const userRepository = new UserDatabaseRepository(connection)
    const eventRepository = new EventDatabaseRepository(connection)
    return {
      userRepository,
      eventRepository,
      eventUserRepository: {} as EventUserRepository,
      checkInRepository: {} as CheckInRepository
    }
  }
}

export type Repositories = {
  eventRepository: EventRepository
  eventUserRepository: EventUserRepository
  userRepository: UserRepository
  checkInRepository: CheckInRepository
}