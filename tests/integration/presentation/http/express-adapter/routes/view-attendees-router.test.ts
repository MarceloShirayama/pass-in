import request from "supertest";

import { ExpressAdapter } from "@presentation/http/express-adapter"
import { RepositoriesFactory } from "@infra/factories";

describe('ViewAttendeesRouter', async () => {
  const repositories = RepositoriesFactory.inMemory
  const server = new ExpressAdapter(repositories);
  const app = server.application;

  it('should be able to view attendees list', async () => {
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        username: 'organizer',
        password: "Organizer*1"
      })
    const accessTokenOrganizer = responseLogin.body.accessToken
    const response = await request(app)
      .get('/attendees')
      .set('Authorization', `Bearer ${accessTokenOrganizer}`)
      .send()
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('email')
    expect(response.body[0]).toHaveProperty('username')
    expect(response.body[0]).toHaveProperty('createdAt')
  })

  it('should return an error if user is not organizer', async () => {
    const responseLogin = await request(app)
      .post('/users/login')
      .send({
        username: 'attendee',
        password: "Attendee*1"
      })
    const accessTokenAttendee = responseLogin.body.accessToken
    const response = await request(app)
      .get('/attendees')
      .set('Authorization', `Bearer ${accessTokenAttendee}`)
      .send()
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: { name: 'ForbiddenError', message: 'Access denied' }
    });
  })

  it('should return an error if user is not logged in', async () => {
    const response = await request(app)
      .get('/attendees')
      .send()
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: { name: 'UnauthorizedError', message: 'not logged in' }
    });
  })
})
