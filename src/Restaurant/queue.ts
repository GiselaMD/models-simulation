import { EntitySet, Mode } from '../entitySet'

export class Queue extends EntitySet {
  constructor(name: string, mode: Mode, capacity: number) {
    super(name, mode, capacity)
  }
}
