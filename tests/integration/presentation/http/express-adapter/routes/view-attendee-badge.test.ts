import request from "supertest";

import {
  inMemoryEventRepository,
  inMemoryEventUserRepository,
  inMemoryUserRepository
} from "@infra/repositories";
import { ExpressAdapter } from "@presentation/http/express-adapter";
import { EventUser } from "@domain/entities";

describe('ViewAttendeeBadgeRouter', async () => {
  const eventRepository = inMemoryEventRepository;
  const eventUserRepository = inMemoryEventUserRepository;
  const userRepository = inMemoryUserRepository;
  const server = new ExpressAdapter();
  const app = server.application;
  const responseLogin = await request(app)
    .post('/users/login')
    .send({
      username: "attendee",
      password: "Attendee*1"
    })
  const accessTokenAttendee = responseLogin.body.accessToken
  const userId = (await userRepository.findByUsername('attendee'))?.props.id as string
  const eventId = (await eventRepository.findByTitle('Event example'))?.props.id as string

  beforeEach(async () => {
    const eventUser = EventUser.create({ eventId, userId })
    await eventUserRepository.save(eventUser)
  })

  afterEach(async () => {
    await eventUserRepository.clear();
    await userRepository.clear();
    await eventRepository.clear();
  })

  it('should be able to view an attendee badge', async () => {
    const response = await request(app)
      .get(`/attendees/badge`)
      .set('Authorization', `Bearer ${accessTokenAttendee}`)
      .send()
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('badge')
    expect(response.body.badge).toHaveProperty('name', 'Attendee')
    expect(response.body.badge).toHaveProperty('email')
    expect(response.body.badge).toHaveProperty('username', 'attendee')
    expect(response.body.badge.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Event example',
          slug: 'event-example',
          details: "details of event example"
        })
      ])
    )
  })
})