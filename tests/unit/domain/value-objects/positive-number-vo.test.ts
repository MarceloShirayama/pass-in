import { PositiveNumberVO } from "@/domain/value-objects"
import { InvalidParamError } from "@/shared/error"

describe('PositiveNumberVO value object', () => {
  it('should create a positive number value object with valid value', () => {
    const input = {
      paramName: 'maximum attendees',
      value: 10
    }
    const id = PositiveNumberVO.create(input)
    expect(id).toBeInstanceOf(PositiveNumberVO)
    expect(id!.value).toBe(10)
  })

  it.each(['10', 0, -1, 1.1])('should return an error with value is less than 0', (value) => {
    const input = {
      paramName: 'maximum attendees',
      value
    }
    expect(
      () => PositiveNumberVO.create(input)
    ).toThrow(new InvalidParamError(`${input.paramName} must be a positive number`))
  })

  it.each([null, ""])('should return an error if value is null or undefined', (value) => {
    const input = {
      paramName: 'maximum attendees',
      value
    }
    expect(
      () => PositiveNumberVO.create(input)
    ).toThrow(new InvalidParamError(`${input.paramName} is required`))
  })
})