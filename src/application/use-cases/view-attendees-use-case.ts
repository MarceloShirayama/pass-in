import { UserRepository } from "@application/repositories"

type ViewAttendeesOut = {
  id: string
  name: string
  username: string
  email: string
  createdAt: string
}

export class ViewAttendeesUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(): Promise<ViewAttendeesOut[]> {
    const attendees = await this.userRepository.getAllByRole("ATTENDEE")
    return attendees.map(attendee => ({
      id: attendee.props.id,
      name: attendee.props.name.value,
      username: attendee.props.username.value,
      email: attendee.props.email.value,
      createdAt: attendee.props.createdAt
    }))
  }
}