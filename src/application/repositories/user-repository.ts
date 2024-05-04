import { Role, User } from "@/domain/entities"

export type UserRepository = {
  save(user: User): Promise<void>
  findByUsername(username: unknown): Promise<User | null>
  findById(id: unknown): Promise<User | null>
  changeRole(id: string, role: Role): Promise<void>
  getAll(): Promise<User[]>
}