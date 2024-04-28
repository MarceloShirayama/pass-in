import { CreateUserIn, User } from "@domain/entities";

describe('User entity', () => {
  it('should create an user with valid values', () => {
    const input: CreateUserIn = {
      name: 'any name',
      username: 'any username',
      password: 'anyPassword*1'
    }
    const user = User.create(input)
    expect(user).toBeInstanceOf(User)
    expect(user.props.name.value).toBe(input.name)
    expect(user.props.username.value).toBe(input.username)
    expect(user.props.password.value).toBe(input.password)
    const user_restored = User.restore({
      id: user.props.id,
      name: user.props.name.value,
      username: user.props.username.value,
      password: user.props.password.value,
      createdAt: user.props.createdAt
    })
    expect(User.equals(user_restored, user)).toBe(true)
  })

  it('should return false if users are not equal', () => {
    const user1 = User.create({
      name: 'any name 1',
      username: 'any username 1',
      password: 'anyPassword*1'
    })
    const user2 = User.create({
      name: 'any name 2',
      username: 'any username 2',
      password: 'anyPassword*1'
    })
    const isEquals = User.equals(user1, user2)
    expect(isEquals).toBe(false)
  })

  it('should return an error if any object is not an user', () => {
    const obj1 = User.create({
      name: 'any name 1',
      username: 'any username 1',
      password: 'anyPassword*1'
    })
    const obj2 = {
      id: 'any_id',
      name: 'any name 2',
      username: 'any username 2',
      password: 'anyPassword*1'
    }
    expect(() => User.equals(obj1, obj2)).toThrow(
      new Error("User must be an instance of User class")
    )
  })
})