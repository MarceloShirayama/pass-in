import request from 'supertest';

import { app } from "@presentation/http/server";
import { inMemoryEventRepository } from "@infra/repositories";

describe('EventsRouter', () => {
  const eventRepository = inMemoryEventRepository;

  beforeEach(async () => {
    await eventRepository.clear();
  })

  it('should be register an event with valid input', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('title', input.title)
    expect(response.body).toHaveProperty('slug')
    expect(response.body).toHaveProperty('details', input.details)
    expect(response.body).toHaveProperty('maximumAttendees')
    expect(response.body).toHaveProperty('createdAt')
  })

  it('should be register an event with valid input without details and maximumAttendees', async () => {
    const input = {
      title: 'any title'
    }
    const response = await request(app)
      .post('/events/register')
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
      .send(input)
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'title already exists')
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
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'title is required')
  })

  it('should return an error if title is not a string', async () => {
    const input = {
      title: 123,
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'title must be a string')
  })

  it('should return an error if title length less than min length', async () => {
    const input = {
      title: 'ab',
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'title must be greater than 3 characters')
  })

  it('should return an error if title length greater than max length', async () => {
    const input = {
      title: 'a'.repeat(51),
      details: 'any details',
      maximumAttendees: 10
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'title must be less than 50 characters')
  })

  it.each(["1", -1, 1.1, 0])('should return an error if maximumAttendees is not a positive number', async (maximumAttendees) => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: maximumAttendees
    }
    const response = await request(app)
      .post('/events/register')
      .send(input)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'maximumAttendees must be a positive number')
  })
})