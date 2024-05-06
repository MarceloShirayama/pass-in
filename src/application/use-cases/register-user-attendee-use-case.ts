import { CreateUserIn, User } from "@domain/entities";
import { UserRepository } from "@application/repositories";
import { ConflictError } from "@shared/error";

type RegisterUserIn = CreateUserIn

export class RegisterUserAttendeeUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(input: RegisterUserIn): Promise<void> {
    const alreadyExistsUserWithSameUsername = await this.userRepository.findByUsername(input.username as string)
    if (alreadyExistsUserWithSameUsername)
      throw new ConflictError("username already exists")
    const user = User.create(input)
    await this.userRepository.save(user)
  }
}