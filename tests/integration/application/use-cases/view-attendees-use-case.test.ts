import { ViewAttendeesUseCase } from "@application/use-cases/view-attendees-use-case";
import { inMemoryUserRepository } from "@infra/repositories";

describe('ViewAttendeesUseCase', () => {
  const userRepository = inMemoryUserRepository;
  const useCase = new ViewAttendeesUseCase(userRepository);

  it('should be able to view all attendees', async () => {
    const output = await useCase.execute()
    expect(output).toHaveLength(1)
    expect(output[0]).toHaveProperty('id')
    expect(output[0]).toHaveProperty('name')
    expect(output[0]).toHaveProperty('email')
    expect(output[0]).toHaveProperty('username')
    expect(output[0]).toHaveProperty('createdAt')
  })
})
