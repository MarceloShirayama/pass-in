import { Attendee } from "@domain/entities";

describe('Attendee entity', () => {
  it('should create an attendee with valid values', () => {
    const input = {
      name: 'any name',
      email: 'any_email@mail.com',
      eventId: 'any_event_id'
    }
    const attendee = Attendee.create(input)
    expect(attendee).toBeInstanceOf(Attendee)
    expect(attendee.props.name.value).toBe(input.name)
    expect(attendee.props.email.value).toBe(input.email)
    const restoredAttendee = Attendee.restore({
      id: attendee.props.id,
      name: attendee.props.name.value,
      email: attendee.props.email.value,
      eventId: attendee.props.eventId,
      createdAt: attendee.props.createdAt
    })
    expect(Attendee.equals(restoredAttendee, attendee)).toBe(true)
  })
})
