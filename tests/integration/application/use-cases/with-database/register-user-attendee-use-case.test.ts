import { RegisterUserAttendeeUseCase } from "@application/use-cases";
import { PostgresAdapter } from "@infra/database";
import { RepositoriesFactory } from "@infra/factories";
import { ConflictError } from "@shared/error";

describe('RegisterUserAttendeeUseCase', () => {
  const sut = () => {
    const repositories = RepositoriesFactory.database
    const connection = new PostgresAdapter()
    const userRepo = repositories.userRepository
    const useCase = new RegisterUserAttendeeUseCase(userRepo);
    return { useCase, userRepo, connection }
  }
  const input = {
    name: 'any name',
    email: 'any_email@mail.com',
    username: 'any username',
    password: 'anyPassword*1'
  }
  const { connection } = sut()
  afterEach(async () => {
    await connection.query(/*sql*/`
      DELETE FROM tb_user
      WHERE username = $1
    `, [input.username]
    )
  })

  it('should be able to register an user attendee with valid input', async () => {
    const { useCase, userRepo } = sut()
    await useCase.execute(input)
    const user = await userRepo.findByUsername(input.username)
    expect(user).not.toBeNull()
    expect(user?.props.name.value).toBe(input.name)
    expect(user?.props.username.value).toBe(input.username)
    expect(user?.props.password.value).toBeTruthy()
  })

  it('should return an error if username already exists', async () => {
    const { useCase } = sut()
    await useCase.execute(input)
    await expect(useCase.execute(input)).rejects.toThrowError(
      new ConflictError("username already exists")
    )
  })
})