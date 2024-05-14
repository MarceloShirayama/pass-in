import { User } from "@/domain/entities";
import { UserRepository } from "@application/repositories";
import { Connection } from "@infra/database";

export class UserDatabaseRepository implements UserRepository {

  constructor(private readonly connection: Connection) { }

  async save(user: User): Promise<void> {
    const {
      user_id, name, username, email, password, role, created_at
    } = this.#fromDomainToDatabase(user)

    await this.connection.query(
      /*sql*/`
        INSERT INTO tb_user
        (user_id, name, username, email, password, role, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [user_id, name, username, email, password, role, created_at]
    )
  }
  async findByUsername(username: unknown): Promise<User | null> {
    const [userData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_user
        WHERE username = $1
      `,
      [username]
    )

    if (!userData) {
      return null
    }
    return this.#fromDatabaseToDomain(userData)
  }
  async findById(id: unknown): Promise<User | null> {
    const [userData] = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_user
        WHERE user_id = $1
      `,
      [id]
    )
    if (!userData) {
      return null
    }
    return this.#fromDatabaseToDomain(userData)
  }
  async changeRole(id: string, role: "ORGANIZER" | "ATTENDEE"): Promise<void> {
    await this.connection.query(
      /*sql*/`
        UPDATE tb_user
        SET role = $1
        WHERE user_id = $2
      `,
      [role, id]
    )
  }
  async getAll(): Promise<User[]> {
    const usersData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_user
      `
    )
    return usersData.map(userData => this.#fromDatabaseToDomain(userData))
  }
  async getAllByRole(role: "ORGANIZER" | "ATTENDEE"): Promise<User[]> {
    const usersData = await this.connection.query(
      /*sql*/`
        SELECT * FROM tb_user
        WHERE role = $1
      `,
      [role]
    )
    return usersData.map(userData => this.#fromDatabaseToDomain(userData))
  }

  #fromDatabaseToDomain(user: any): User {
    return User.restore({
      id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.created_at
    })
  }

  #fromDomainToDatabase(user: User) {
    const { id, name, username, email, password, role, createdAt } = user.props
    return {
      user_id: id,
      name: name.value,
      email: email.value,
      username: username.value,
      password: password.value,
      role,
      created_at: createdAt
    }
  }
}