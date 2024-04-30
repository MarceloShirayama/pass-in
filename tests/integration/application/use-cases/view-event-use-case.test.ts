import { InvalidParamError, NotFoundError } from "@/shared/error";
import { ViewEventUseCase } from "@application/use-cases";
import { Event } from "@domain/entities";
import { inMemoryEventRepository } from "@infra/repositories";


describe('ViewEventUseCase', () => {
  const eventRepository = inMemoryEventRepository;
  const useCase = new ViewEventUseCase(eventRepository);

  beforeEach(async () => {
    await eventRepository.clear();
  });

  it('should be able to view an event by id', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const event = Event.create(input);
    await eventRepository.save(event);
    const output = await useCase.execute({
      id: event.props.id
    })
    expect(output).toHaveProperty('id', event.props.id)
    expect(output).toHaveProperty('title', event.props.title.value)
    expect(output).toHaveProperty('slug', event.props.slug)
    expect(output).toHaveProperty('details', event.props.details?.value)
    expect(output).toHaveProperty('maximumAttendees', event.props.maximumAttendees?.value)
    expect(output).toHaveProperty('createdAt', event.props.createdAt)
  })

  it('should be able to view an event by title', async () => {
    const input = {
      title: 'any title',
      details: 'any details',
      maximumAttendees: 10
    }
    const event = Event.create(input);
    await eventRepository.save(event);
    const output = await useCase.execute({
      title: event.props.title.value
    })
    expect(output).toHaveProperty('id', event.props.id)
    expect(output).toHaveProperty('title', event.props.title.value)
    expect(output).toHaveProperty('slug', event.props.slug)
    expect(output).toHaveProperty('details', event.props.details?.value)
    expect(output).toHaveProperty('maximumAttendees', event.props.maximumAttendees?.value)
    expect(output).toHaveProperty('createdAt', event.props.createdAt)
  })

  it('should return null if search for event id an unregistered event', async () => {
    const input = {
      id: 'any id',
    }
    const output = await useCase.execute(input)
    expect(output).toBeNull()
  })

  it('should return null if search for event title an unregistered event', async () => {
    const input = {
      title: 'any title',
    }
    const output = await useCase.execute(input)
    expect(output).toBeNull()
  })
})