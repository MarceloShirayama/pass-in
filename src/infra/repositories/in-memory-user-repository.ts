import { UserRepository } from "@/application/repositories";
import { User } from "@/domain/entities";
import { InvalidParamError } from "@/shared/error";

const organizer = User.create({
  name: "Organizer",
  email: "C9h6H@example.com",
  username: "organizer",
  password: "Organizer*1",
})

const attendee = User.create({
  name: "Attendee",
  email: "C9h6H@example.com",
  username: "attendee",
  password: "Attendee*1",
})

organizer.role = "ORGANIZER"

class InMemoryUserRepository implements UserRepository {
  #users: User[] = [organizer, attendee]

  async save(user: User): Promise<void> {
    this.#users.push(user)
  }
  async findByUsername(username: unknown): Promise<User | null> {
    const user = this.#users.find(user => user.props.username.value === username)
    if (!user) {
      return null
    }
    return user
  }
  async findById(id: unknown): Promise<User | null> {
    const user = this.#users.find(user => user.props.id === id)
    if (!user) {
      return null
    }
    return user
  }
  async changeRole(id: string, role: "ORGANIZER" | "ATTENDEE"): Promise<void> {
    const user = this.#users.find(user => user.props.id === id)
    if (!user) {
      throw new InvalidParamError("User not found");

    }
    user.props.role = role
  }

  async clear(): Promise<void> {
    this.#users = []
  }

  async getAll(): Promise<User[]> {
    return this.#users
  }

  async getAllByRole(role: "ORGANIZER" | "ATTENDEE"): Promise<User[]> {
    return this.#users.filter(user => user.props.role === role)
  }
}

export const inMemoryUserRepository = new InMemoryUserRepository()