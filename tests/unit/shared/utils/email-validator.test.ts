import { EmailValidator } from "@/shared/utils"

describe('email validator', () => {
  it('should return true if email is valid', () => {
    const email = 'JlU3G@example.com' as unknown
    expect(EmailValidator.isValid(email)).toBe(true)
  })

  it.each([
    'any_email',
    'any_email@',
    'any_email@.com',
    'any_email@com',
    'any*email@mail.com',
    10
  ])('should return false if email is invalid', (email) => {
    expect(EmailValidator.isValid(email)).toBe(false)
  })
})