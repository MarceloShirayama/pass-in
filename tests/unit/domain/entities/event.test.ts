import { CreateEventIn, Event } from '@/domain/entities'
import { InvalidParamError } from '@/shared/error'

describe('Event entity', () => {
  it('should create an event with valid values', () => {
    const input: CreateEventIn = {
      title: 'event 1',
    }
    const event = Event.create(input)
    expect(event).toBeInstanceOf(Event)
    expect(event.props.title.value).toBe(input.title)
    expect(event.props.details).toBe(null)
    const event_restored = Event.restore({
      id: event.props.id,
      title: event.props.title.value,
      details: event.props.details?.value,
      maximumAttendees: event.props.maximumAttendees?.value,
      createdAt: event.props.createdAt
    })
    expect(Event.equals(event_restored, event)).toBe(true)
  })

  it('should create an event with details', () => {
    const input: CreateEventIn = {
      title: 'event 2',
      details: 'some details',
    }
    const event = Event.create(input)
    expect(event).toBeInstanceOf(Event)
    expect(event.props.details?.value).toBe(input.details)
  })

  it('should create an event with maximum attendees', () => {
    const input: CreateEventIn = {
      title: 'event 3',
      maximumAttendees: 10,
    }
    const event = Event.create(input)
    expect(event).toBeInstanceOf(Event)
    expect(event.props.maximumAttendees?.value).toBe(input.maximumAttendees)
  })


  it.each([null, ''])('should return an error if title is null or empty', (title) => {
    const input: CreateEventIn = {
      title,
    }
    expect(() => Event.create(input)).toThrow(
      new InvalidParamError('title is required')
    )
  })

  it('should return false if events are not equal', () => {
    const event1 = Event.create({
      title: 'event 1',
    })
    const event2 = Event.create({
      title: 'event 2',
    })
    const isEquals = Event.equals(event1, event2)
    expect(isEquals).toBe(false)
  })

  it('should return an error if any object is not an event', () => {
    const obj1 = Event.create({
      title: 'event 1',
    })
    const obj2 = {
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      details: 'any_details',
      maximumAttendees: 10,
      createdAt: 'any_createdAt'
    }
    expect(() => Event.equals(obj1, obj2)).toThrow(
      new Error("Event must be an instance of Event class")
    )
  })
})