import request from "supertest";

import {
  inMemoryEventRepository,
  inMemoryEventUserRepository,
  inMemoryUserRepository,
  inMemoryCheckInRepository
} from "@infra/repositories";
import { ExpressAdapter } from "@presentation/http/express-adapter";
import { EventUser } from "@domain/entities";


describe('CheckInRouter', async () => {
  const eventRepository = inMemoryEventRepository;
  const eventUserRepository = inMemoryEventUserRepository;
  const userRepository = inMemoryUserRepository;
  const checkInRepository = inMemoryCheckInRepository;
  const server = new ExpressAdapter();
  const app = server.application;
  const responseLogin = await request(app)
    .post('/users/login')
    .send({
      username: "attendee",
      password: "Attendee*1"
    })
  const accessToken = responseLogin.body.accessToken
  const userId = (await userRepository.findByUsername('attendee'))?.props.id!
  const eventId = (await eventRepository.findByTitle('Event example'))?.props.id!

  afterEach(async () => {
    await eventUserRepository.clear();
    await checkInRepository.clear();
  })

  it('should be able to check in an user in an event', async () => {
    const eventUser = EventUser.create({ eventId, userId })
    await eventUserRepository.save(eventUser)
    const response = await request(app)
      .post(`/attendees/${userId}/check-in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ eventId })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('eventId')
    expect(response.body).toHaveProperty('userId')
  })

  it('should return an error if check in an user in an unregistered event', async () => {
    const response = await request(app)
      .post(`/attendees/${userId}/check-in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ eventId })
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: {
        name: 'ConflictError',
        message: 'attendee not registered in this event'
      }
    })
  })

  it('should return an error if attendee already checked in', async () => {
    const eventUser = EventUser.create({ eventId, userId })
    await eventUserRepository.save(eventUser)
    await request(app)
      .post(`/attendees/${userId}/check-in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ eventId })
    const response = await request(app)
      .post(`/attendees/${userId}/check-in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ eventId })
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: {
        name: 'ConflictError',
        message: 'attendee already checked in event'
      }
    })
  })

  it('should return an error if user not logged in', async () => {
    const response = await request(app)
      .post(`/attendees/${userId}/check-in`)
      .send({ eventId })
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: {
        name: 'UnauthorizedError',
        message: 'not logged in'
      }
    })
  })
})