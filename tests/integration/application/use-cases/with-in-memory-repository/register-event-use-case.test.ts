import { InvalidParamError } from "@/shared/error";
import { RegisterEventUseCase } from "@application/use-cases";
import { inMemoryEventRepository } from "@infra/repositories";

describe('RegisterEventUseCase', () => {
  const eventRepository = inMemoryEventRepository;
  const useCase = new RegisterEventUseCase(eventRepository);

  beforeEach(async () => {
    await eventRepository.clear();
  });

  it('should be register an event', async () => {
    const output = await useCase.execute({
      title: 'any title'
    })
    expect(output).toHaveProperty('id')
    expect(output).toHaveProperty('title', 'any title')
    expect(output).toHaveProperty('slug')
    expect(output).toHaveProperty('details')
    expect(output).toHaveProperty('maximumAttendees')
    expect(output).toHaveProperty('createdAt')
  });

  it('should return an error if title already exists', async () => {
    const input = {
      title: 'any title'
    }
    await useCase.execute(input)
    expect(() => useCase.execute(input)).rejects.toThrow(
      new InvalidParamError('title already exists')
    )
  });
});