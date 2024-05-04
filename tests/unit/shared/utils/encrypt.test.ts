import { Encrypt } from "@shared/utils";

describe('encrypt', () => {
  it('should return a encrypted text and compare it', () => {
    const text = 'any_text'
    const encrypted = Encrypt.hash(text)
    expect(encrypted).not.toBe(text)
    const isEqual = Encrypt.compare(text, encrypted)
    expect(isEqual).toBe(true)
  })

  it('should return false if text is not equal to encrypted', () => {
    const text = 'any_text'
    const encrypted = Encrypt.hash(text)
    expect(encrypted).not.toBe(text)
    const isEqual = Encrypt.compare('other_text', encrypted)
    expect(isEqual).toBe(false)
  })
})