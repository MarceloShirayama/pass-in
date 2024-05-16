import request from "supertest";

import { User } from "@domain/entities";
import {
  inMemoryUserRepository
} from "@infra/repositories";
import { RepositoriesFactory } from "@infra/factories";
import { ExpressAdapter } from "@presentation/http/express-adapter";

describe('RegisterAttendeeInEventRouter', async () => {
  const repositories = RepositoriesFactory.inMemory
  const {
    eventRepository, eventUserRepository
  } = repositories
  const server = new ExpressAdapter(repositories);
  const app = server.application;
  const event = await eventRepository.findByTitle('Event example')
  const responseLogin = await request(app)
    .post('/users/login')
    .send({
      username: "attendee",
      password: "Attendee*1"
    })
  const accessToken = responseLogin.body.accessToken

  beforeEach(async () => {
    await eventUserRepository.clear();
  })

  it('should be able to register an attendee in an event', async () => {
    const response = await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('eventId')
    expect(response.body).toHaveProperty('userId')
  })

  it('should return an error if user already registered in event', async () => {
    await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    const response = await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: {
        name: 'ConflictError',
        message: 'attendee is already registered for this event'
      }
    })
  })

  it(
    'should return an error if number of attendees in event exceed maximum',
    async () => {
      await request(app)
        .post(`/events/${event!.props.id}/attendees`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
      const attendee2 = User.create({
        name: 'any name',
        username: 'any username',
        email: 'any-email@mail.com',
        password: 'anyPassword*2'
      })
      await inMemoryUserRepository.save(attendee2)
      const responseLoginAttendee2 = await request(app)
        .post('/users/login')
        .send({
          username: "any username",
          password: "anyPassword*2"
        })
      const accessTokenAttendee2 = responseLoginAttendee2.body.accessToken
      await request(app)
        .post(`/events/${event!.props.id}/attendees`)
        .set('Authorization', `Bearer ${accessTokenAttendee2}`)
        .send()
      const response = await request(app)
        .post(`/events/${event!.props.id}/attendees`)
        .set('Authorization', `Bearer ${accessTokenAttendee2}`)
        .send()
      expect(response.status).toBe(409)
      expect(response.body).toEqual({
        error: {
          name: 'ConflictError',
          message: 'event is full'
        }
      })
    }
  )

  it('should return an error if event not found', async () => {
    const response = await request(app)
      .post(`/events/any-id/attendees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: {
        name: 'NotFoundError',
        message: 'event not found'
      }
    })
  })

  it('should return an error if user not logged in', async () => {
    const response = await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .send()
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: {
        name: 'UnauthorizedError',
        message: 'not logged in'
      }
    })
  })
})