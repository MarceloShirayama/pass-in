import request from "supertest";

import {
  inMemoryEventRepository,
  inMemoryEventUserRepository
} from "@infra/repositories";
import { ExpressAdapter } from "@presentation/http/express-adapter";

describe('RegisterAttendeeInEventRouter', async () => {
  const eventRepository = inMemoryEventRepository;
  const eventUserRepository = inMemoryEventUserRepository;
  const server = new ExpressAdapter();
  const app = server.application;
  const event = await eventRepository.findByTitle('Event example')
  const responseLogin = await request(app)
    .post('/users/login')
    .send({
      username: "attendee",
      password: "Attendee*1"
    })
  const accessTokenOrganizer = responseLogin.body.accessToken

  beforeEach(async () => {
    await eventUserRepository.clear();
  })

  it('should be able to register an attendee in an event', async () => {
    const response = await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('eventId')
    expect(response.body).toHaveProperty('userId')
  })

  it('should return an error if user already registered in event', async () => {
    await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    const response = await request(app)
      .post(`/events/${event!.props.id}/attendees`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: {
        name: 'ConflictError',
        message: 'attendee is already registered for this event'
      }
    })
  })

  it('should return an error if event not found', async () => {
    const response = await request(app)
      .post(`/events/any-id/attendees`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
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
        message: 'No token provided'
      }
    })
  })
})