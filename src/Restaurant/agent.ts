import { Entity } from 'src/entity'

export class Agent extends Entity {
  constructor({ name, petriNet }: { name: string; petriNet?: any }) {
    super({ name, petriNet })
  }
}
