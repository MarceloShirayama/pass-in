import request from 'supertest';

import { ExpressAdapter } from "@/presentation/http/express-adapter";
import { Event } from "@domain/entities";
import { RepositoriesFactory } from '@infra/factories';

describe('ViewEventRouter', async () => {
  const repositories = RepositoriesFactory.inMemory
  const {
    eventRepository,
  } = repositories
  const server = new ExpressAdapter(repositories);
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

  it('should be able to view an event by id', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const event = Event.create(input);
    await eventRepository.save(event);
    const response = await request(app)
      .get(`/events/${event.props.id}/search`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', event.props.id)
    expect(response.body).toHaveProperty('title', event.props.title.value)
    expect(response.body).toHaveProperty('slug', event.props.slug)
    expect(response.body).toHaveProperty('details', event.props.details?.value)
    expect(response.body).toHaveProperty('maximumAttendees', event.props.maximumAttendees?.value)
    expect(response.body).toHaveProperty('createdAt', event.props.createdAt)
  })

  it('should be able to view an event by title', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const event = Event.create(input);
    await eventRepository.save(event);
    const response = await request(app)
      .get(`/events/search?title=${event.props.title.value}`)
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', event.props.id)
    expect(response.body).toHaveProperty('title', event.props.title.value)
    expect(response.body).toHaveProperty('slug', event.props.slug)
    expect(response.body).toHaveProperty('details', event.props.details?.value)
    expect(response.body).toHaveProperty('maximumAttendees', event.props.maximumAttendees?.value)
    expect(response.body).toHaveProperty('createdAt', event.props.createdAt)
  })

  it('should return an error if search for event id an unregistered event', async () => {
    const response = await request(app)
      .get('/events/any-id/search')
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

  it('should return an error if search for event title an unregistered event', async () => {
    const response = await request(app)
      .get('/events/search?title=any-title')
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

  it('should return an error if search for event title and title is not provided', async () => {
    const response = await request(app)
      .get('/events/search?title=')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: {
        name: 'InvalidParamError',
        message: 'title is required'
      }
    })
  })

  it('should return an error if user is not authorized', async () => {
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        username: 'attendee',
        password: "Attendee*1"
      })
    const accessToken = responseLogin.body.accessToken
    const response = await request(app)
      .get('/events/any-id/search')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(403)
    expect(response.body).toEqual({
      error: {
        name: 'ForbiddenError',
        message: 'Access denied'
      }
    })
  })
})