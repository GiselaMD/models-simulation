import { Resource } from '../resource'

export class Garcom extends Resource {
  constructor(name: string, quantity: number) {
    super('test', quantity)
  }
}
