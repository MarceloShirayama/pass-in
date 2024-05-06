import { ConflictError } from "@/shared/error";
import { UserRepository } from "@application/repositories";
import { Encrypt } from "@shared/utils";
import { JWTPort } from "../jwt";

export class UserLoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private readonly jwt: JWTPort
  ) { }

  async execute(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new ConflictError('Invalid user or password')
    }
    const comparedPassword = Encrypt.compare(password, user.props.password.value)
    if (!comparedPassword) {
      throw new ConflictError('invalid user or password')
    }
    const accessToken = await this.jwt.sign(
      { id: user.props.id }
    )
    return { accessToken }
  }
}