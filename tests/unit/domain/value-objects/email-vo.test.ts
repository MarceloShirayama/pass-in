import { EmailVO } from "@/domain/value-objects"
import { InvalidParamError } from "@/shared/error"

describe('EmailVO value object', () => {
  it('should create a email value object with valid value', () => {
    const input = 'any_email@mail.com'
    const email = EmailVO.create(input)
    expect(email).toBeInstanceOf(EmailVO)
    expect(email!.value).toBe(input)
  })

  it.each([
    'any_email',
    'any_email@',
    'any_email@.com',
    'any_email@com',
    'any*email@mail.com',
    10
  ])('should return an error with invalid value', (email) => {
    expect(
      () => EmailVO.create(email)
    ).toThrow(new InvalidParamError('invalid email'))
  })
})