import { UserRepository } from "@/application/repositories";
import { User } from "@/domain/entities";
import { InvalidParamError } from "@/shared/error";

class InMemoryUserRepository implements UserRepository {
  #users: User[] = []

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
}

export const inMemoryUserRepository = new InMemoryUserRepository()