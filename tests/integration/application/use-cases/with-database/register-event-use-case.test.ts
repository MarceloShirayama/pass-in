import { InvalidParamError } from "@shared/error";
import { RegisterEventUseCase } from "@application/use-cases";
import { RepositoriesFactory } from "@infra/factories";
import { PostgresAdapter } from "@infra/database";

describe('RegisterEventUseCase with database repository', () => {
  const sut = () => {
    const repositories = RepositoriesFactory.database;
    const connection = new PostgresAdapter();
    const { eventRepository } = repositories
    const useCase = new RegisterEventUseCase(eventRepository);
    return { useCase, eventRepository, connection }
  }

  const input = {
    title: 'any title',
    details: 'any details',
    maximumAttendees: 10
  }

  afterEach(async () => {
    const connection = sut().connection
    await connection.query(/*sql*/`
      DELETE FROM tb_event
      WHERE title = $1
    `, [input.title]
    )
  })

  it('should be able to register an event with valid input', async () => {
    const { useCase, eventRepository } = sut()
    await useCase.execute(input)
    const event = await eventRepository.findByTitle(input.title)
    expect(event).not.toBeNull()
    expect(event?.props.title.value).toBe(input.title)
    expect(event?.props.slug).toBeTruthy()
    expect(event?.props.details?.value).toBe(input.details)
    expect(event?.props.maximumAttendees?.value).toBe(input.maximumAttendees)
    expect(event?.props.createdAt).toBeTruthy()
  })
})