import { uuid } from 'uuidv4'

export class Event {
  name: string
  eventId: string

  constructor(name: string) {
    this.name = name
    this.eventId = uuid()
  }
}
