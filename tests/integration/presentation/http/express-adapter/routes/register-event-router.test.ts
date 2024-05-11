import request from 'supertest';

import { ExpressAdapter } from "@/presentation/http/express-adapter";
import { InternalServerError } from '@/shared/error';
import { inMemoryEventRepository } from "@infra/repositories";

describe('EventsRouter', async () => {
  const eventRepository = inMemoryEventRepository;
  const server = new ExpressAdapter();
  const app = server.application;
  const responseLogin = await request(app)
    .post('/users/login')
    .send({
      username: 'organizer',
      password: "Organizer*1"
    })

  const accessTokenOrganizer = responseLogin.body.accessToken

  beforeEach(async () => {
    await eventRepository.clear();
  })

  it('should be register an event with valid input', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const responseRegisterEvent = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)

    expect(responseRegisterEvent.status).toBe(201)
    expect(responseRegisterEvent.body).toHaveProperty('id')
    expect(responseRegisterEvent.body).toHaveProperty('title', input.title)
    expect(responseRegisterEvent.body).toHaveProperty('slug')
  })

  it('return an error if token is not provided', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: {
        name: 'UnauthorizedError',
        message: 'not logged in'
      }
    })
  })

  it('should return an error if user is not an organizer', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        username: 'attendee',
        password: "Attendee*1"
      })
    const accessToken = responseLogin.body.accessToken
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(input)

    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      error: {
        name: 'ForbiddenError',
        message: 'Access denied'
      }
    })
  })

  it('should be register an event with valid input without details and maximumAttendees', async () => {
    const input = {
      title: 'any title'
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('title', input.title)
    expect(response.body).toHaveProperty('slug')
  })

  it('should return an error if title already exists', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: {
        name: 'ConflictError',
        message: 'title already exists'
      }
    })
  })

  it.each(
    ["", null, undefined]
  )('should return an error if title is not provided', async (title) => {
    const input = {
      title,
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'title is required'
      }
    })
  })

  it('should return an error if title is not a string', async () => {
    const input = {
      title: 123,
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'title must be a string'
      }
    })
  })

  it('should return an error if title length less than min length', async () => {
    const input = {
      title: 'ab',
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'title must be greater than 3 characters'
      }
    })
  })

  it('should return an error if title length greater than max length', async () => {
    const input = {
      title: 'a'.repeat(51),
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'title must be less than 50 characters'
      }
    })
  })

  it.each(["1", -1, 1.1, 0])('should return an error if maximumAttendees is not a positive number', async (maximumAttendees) => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: maximumAttendees
    }
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'maximumAttendees must be a positive number'
      }
    })
  })

  it('should return an Internal Server Error if an exception is thrown an Internal Server Error', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 1
    }
    vi.spyOn(eventRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerError("test internal server error")
    })
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: {
        name: 'InternalServerError',
        message: 'An internal server error occurred, contact support'
      }
    })
  })

  it('should return an Unexpected Error if an exception is thrown an Unexpected Error', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 1
    }
    vi.spyOn(eventRepository, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await request(app)
      .post('/events/register')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send(input)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: {
        name: 'UnexpectedError',
        message: 'An unexpected error occurred, contact support'
      }
    })
  })
})