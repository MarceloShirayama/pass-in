import request from 'supertest';

import { ExpressAdapter } from "@presentation/http/express-adapter";
import { inMemoryUserRepository } from "@infra/repositories";
import { User } from '@/domain/entities';

describe('UserLoginRouter', () => {
  const userRepository = inMemoryUserRepository;
  const server = new ExpressAdapter();
  const app = server.application;

  beforeEach(async () => {
    await userRepository.clear();
  })

  it('should be able to login an user with user registered', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const user = User.create(input)
    await userRepository.save(user)

    const response = await request(app)
      .post('/users/login')
      .send({
        username: input.username,
        password: input.password
      })
    const output = response.body
    expect(response.status).toBe(200)
    expect(output.accessToken).toBeDefined()
  })
})