import request from "supertest";

import { ExpressAdapter } from "@presentation/http/express-adapter";
import { inMemoryUserRepository } from "@infra/repositories";
import { InternalServerError } from "@shared/error";

describe('UsersRouter', () => {
  const userRepository = inMemoryUserRepository;
  const server = new ExpressAdapter();
  const app = server.application;

  beforeEach(async () => {
    await userRepository.clear();
  })

  it('should be register an user with valid input', async () => {
    const input = {
      name: 'any name',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/users/register')
      .send(input)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'user created' })

  })

  it('should return an error if name is not provided', async () => {
    const input = {
      name: '',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/users/register')
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
      username: '',
      password: 'anyPassword*1'
    }
    const response = await request(app)
      .post('/users/register')
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
      username: 'any username',
      password: ''
    }
    const response = await request(app)
      .post('/users/register')
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
      username: 'any username',
      password: 'ab*P1'
    }
    const response = await request(app)
      .post('/users/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'password length must be between 8 and 50 characters'
      }
    })
  })
})