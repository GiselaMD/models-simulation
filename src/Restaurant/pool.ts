import { Resource } from '../resource'

export class Pool extends Resource {
  constructor(name: string, quantity: number) {
    super(name, quantity)
  }
}
