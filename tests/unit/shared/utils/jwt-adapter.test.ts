import { JWTAdapter } from "@shared/utils";

describe('jwt adapter', () => {
  it('should return a token', async () => {
    const jwt = new JWTAdapter()
    const token = await jwt.sign({ id: 'any_id' })
    expect(token).toBeTruthy()
  })

  it('should verify a token', async () => {
    const jwt = new JWTAdapter()
    const token = await jwt.sign({ id: 'any_id' })
    const verified = await jwt.verify(token)
    expect(verified).toBeTruthy()
    expect(verified.id).toBe('any_id')
    expect(verified).toHaveProperty('iat')
    expect(verified).toHaveProperty('exp')
  })
})
