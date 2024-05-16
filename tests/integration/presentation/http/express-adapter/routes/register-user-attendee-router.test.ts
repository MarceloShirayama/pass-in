import request from "supertest";

import { RepositoriesFactory } from "@infra/factories";
import { ExpressAdapter } from "@presentation/http/express-adapter";

describe('UsersRouter', () => {
  const repositories = RepositoriesFactory.inMemory
  const userRepository = repositories.userRepository
  const server = new ExpressAdapter(repositories);
  const app = server.application;

  beforeEach(async () => {
    await userRepository.clear();
  })

  it('should be register an user with valid input', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'user created' })

  })

  it('should return an error if name is not provided', async () => {
    const input = {
      name: '',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'name is required'
      }
    })
  })

  it('should return an error if username is not provided', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: '',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'username is required'
      }
    })
  })

  it('should return an error if password is not provided', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: ''
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'password is required'
      }
    })
  })

  it('should return an error if password length less than min length', async () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      username: 'any username',
      password: 'ab*P1'
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'password length must be between 8 and 50 characters'
      }
    })
  })

  it('should return an error if email is not provided', async () => {
    const input = {
      name: 'any name',
      email: '',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/attendees/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'email is required'
      }
    })
  })
})