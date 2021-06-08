import { uuid } from 'uuidv4'

export class Process {
  name: string
  processId: string
  duration: number
  active: boolean

  constructor(name: string, duration: number) {
    this.name = name
    this.duration = duration
    this.processId = uuid()
    this.active = true
  }

  // Métodos

  /**
   * getDuration()
   * @returns Duração do processo
   */
  public getDuration() {
    return this.duration
  }

  /**
   * isActive()
   * @returns Status do processo, ativo ou não
   */
  public isActive() {
    return this.active
  }

  /**
   * activate(bool)
   * @returns seta o status do processo, ativo ou não
   */
  public activate(bool: boolean) {
    this.active = bool
  }
}
