import { User, Event, EventUser } from "@domain/entities";
import { ViewAttendeeBadgeUseCase } from "@application/use-cases";
import {
  inMemoryEventRepository,
  inMemoryEventUserRepository,
  inMemoryUserRepository
} from "@infra/repositories";
import { slugifyText } from "@shared/utils";

describe('ViewAttendeeBadgeUseCase', async () => {
  const eventUserRepo = inMemoryEventUserRepository
  const eventRepo = inMemoryEventRepository
  const userRepo = inMemoryUserRepository
  const useCase = new ViewAttendeeBadgeUseCase(
    userRepo, eventUserRepo, eventRepo
  )
  const attendee = await userRepo.save(User.create({
    name: 'any name',
    email: 'any_email@mail.com',
    username: 'any username',
    password: 'anyPassword*1'
  }))
  const event1 = await eventRepo.save(Event.create({
    title: 'Event 1 title',
    details: 'Event 1 details',
    maximumAttendees: 10
  }))
  const event2 = await eventRepo.save(Event.create({
    title: 'Event 2 title',
    details: 'Event 2 details',
    maximumAttendees: 10
  }))
  const attendeeId = (await userRepo.findByUsername('any username'))?.props.id
  const event1Id = (await eventRepo.findByTitle('Event 1 title'))?.props.id
  const event2Id = (await eventRepo.findByTitle('Event 2 title'))?.props.id
  await eventUserRepo.save({
    userId: attendeeId!,
    eventId: event1Id!
  })
  await eventUserRepo.save({
    userId: attendeeId!,
    eventId: event2Id!
  })

  afterEach(async () => {
    await eventUserRepo.clear();
    await eventRepo.clear();
    await userRepo.clear();
  });

  it('should be able to view an attendee badge', async () => {
    const output = await useCase.execute(attendeeId!)
    expect(output).toEqual(
      expect.objectContaining({
        badge: {
          name: 'any name',
          email: 'any_email@mail.com',
          username: 'any username',
          events: [
            {
              title: 'Event 1 title',
              slug: slugifyText('Event 1 title'),
              details: 'Event 1 details',
            }, {
              title: 'Event 2 title',
              slug: slugifyText('Event 2 title'),
              details: 'Event 2 details',
            }
          ]
        }
      })
    )
  })
})