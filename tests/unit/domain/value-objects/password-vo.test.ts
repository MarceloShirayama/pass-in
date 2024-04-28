import { PasswordVO } from "@/domain/value-objects"
import { InvalidParamError } from "@/shared/error"

describe('PasswordVO value object', () => {
  it('should create a password value object with valid value', () => {
    const input = {
      value: "Password*1"
    }
    const password = PasswordVO.create(input)
    expect(password).toBeInstanceOf(PasswordVO)
    expect(password!.value).toBe(input.value)
  })

  it('should return an error if not value is provided ', () => {
    const input = {
      value: ""
    }
    expect(
      () => PasswordVO.create(input)
    ).toThrow(
      new InvalidParamError("password is required")
    )
  })

  it('should return an error if value is not a string', () => {
    const input = {
      value: 123
    }
    expect(
      () => PasswordVO.create(input)
    ).toThrow(
      new InvalidParamError("password must be a string")
    )
  })

  it.each([
    'Pass*1', 'Pass*1'.repeat(10)
  ])('should return an error if value is less than min length or greater than max length', (value) => {
    const input = {
      value,
      minLength: 8,
      maxLength: 50
    }
    expect(
      () => PasswordVO.create(input)
    ).toThrow(
      new InvalidParamError(
        `password length must be between ${input.minLength} and ${input.maxLength} characters`
      )
    )
  })

  it.each([
    'PASSWORD1*', 'password*1'
  ])('should return an error if value is not contain at least one uppercase letter and one lowercase letter', (value) => {
    const input = {
      value
    }
    expect(
      () => PasswordVO.create(input)
    ).toThrow(
      new InvalidParamError(
        "password must contain at least one uppercase letter and one lowercase letter"
      )
    )
  })

  it.each([
    'Password1', 'Password*'
  ])('should return an error if value is not contain at least one number and one special character', (value) => {
    const input = {
      value
    }
    expect(
      () => PasswordVO.create(input)
    ).toThrow(
      new InvalidParamError(
        "password must contain at least one number and one special character"
      )
    )
  })
})