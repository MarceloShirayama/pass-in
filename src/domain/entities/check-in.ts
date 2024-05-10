type CheckInProps = {
  eventId: string
  userId: string
  createdAt: string
}

type CreateCheckIn = {
  eventId: string
  userId: string
}

export class CheckIn {
  #eventId: string
  #userId: string
  #createdAt: string

  private constructor(props: CheckInProps) {
    this.#eventId = props.eventId
    this.#userId = props.userId
    this.#createdAt = props.createdAt
  }

  static create(props: CreateCheckIn) {
    return new CheckIn({
      eventId: props.eventId,
      userId: props.userId,
      createdAt: new Date().toISOString()
    })
  }

  static restore(props: CheckInProps) {
    return new CheckIn(props)
  }

  get props() {
    return {
      eventId: this.#eventId,
      userId: this.#userId,
      createdAt: this.#createdAt
    }
  }
}