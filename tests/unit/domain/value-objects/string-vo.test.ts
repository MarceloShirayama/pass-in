import { StringVO } from "@/domain/value-objects"
import { InvalidParamError } from '@shared/error'

describe('StringVO value object', () => {
  it('should create a string value object with valid value', () => {
    const title = StringVO.create({
      paramName: 'title',
      value: 'hello'
    })
    expect(title).toBeInstanceOf(StringVO)
    expect(title!.value).toBe('hello')
  })

  it('should return an error with invalid value', () => {
    const input = {
      paramName: 'title',
      value: 123
    }
    expect(
      () => StringVO.create(input)
    ).toThrow(new InvalidParamError(`${input.paramName} must be a string`))
  })

  it('should return an error with empty value', () => {
    expect(() => StringVO.create({
      paramName: 'title',
      value: ''
    })).toThrow()
  })

  it('should return an error with null value', () => {
    const input = {
      paramName: 'title',
      value: null
    }
    expect(
      () => StringVO.create(input)
    ).toThrow(new InvalidParamError(`${input.paramName} is required`))
  })

  it('should returns an error with value with length less than min length', () => {
    const input = {
      paramName: 'title',
      value: 'ab',
      minLength: 3
    }
    expect(
      () => StringVO.create(input)
    ).toThrow(new InvalidParamError(
      `${input.paramName} must be greater than ${input.minLength} characters`
    ))
  })

  it('should returns an error with value with length greater than max length', () => {
    const input = {
      paramName: 'title',
      value: 'a'.repeat(256),
      maxLength: 255
    }
    expect(
      () => StringVO.create(input)
    ).toThrow(new InvalidParamError(
      `${input.paramName} must be less than ${input.maxLength} characters`
    ))
  })
})