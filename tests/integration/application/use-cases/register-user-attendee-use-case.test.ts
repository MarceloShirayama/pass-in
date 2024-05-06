import { RegisterUserAttendeeUseCase } from "@/application/use-cases";
import { inMemoryUserRepository } from "@/infra/repositories";
import { ConflictError } from "@/shared/error";

describe('RegisterUserAttendeeUseCase', () => {
  const userRepo = inMemoryUserRepository
  const useCase = new RegisterUserAttendeeUseCase(userRepo);

  beforeEach(async () => {
    await userRepo.clear();
  });

  it('should be able to register an user attendee with valid input', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'anyPassword*1'
    }
    await useCase.execute(input)
    const user = await userRepo.findByUsername(input.username)
    expect(user).not.toBeNull()
    expect(user?.props.name.value).toBe(input.name)
    expect(user?.props.username.value).toBe(input.username)
    expect(user?.props.password.value).toBeTruthy()

  })

  it('should return an error if username already exists', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'anyPassword*1'
    }
    await useCase.execute(input)

    expect(() => useCase.execute(input)).rejects.toThrow(
      new ConflictError('username already exists')
    )
  })
})