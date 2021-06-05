import { uuid } from 'uuidv4'

export class Entity {
  id: string
  name: string
  creationTime: number
  priority: number // -1 sem prioridade, 0 + alta até 255 + baixa
  petriNet: any // incluir a rede de petri

  constructor(name: string, petriNet: any) {
    this.id = uuid()
    this.name = name
    this.creationTime = 0 // TODO: define this
    this.priority = -1 // set no priority
    this.petriNet = petriNet
  }

  /**
   * getId()
   * @returns Entity id
   */
  public getId() {
    return this.id
  }

  /**
   * getPriority()
   * @returns Entity priority
   */
  public getPriority() {
    return this.priority
  }

  /**
   * setPriority(priority)
   * @param priority - prioridade da Entidade
   */
  public setPriority(priority: number) {
    this.priority = priority
  }

  /**
   * getTimeSinceCreation()
   * @returns Time since creation
   */
  public getTimeSinceCreation() {
    // TODO
    return null
  }

  /**
   * getSets()
   * @returns Lista de filas nas quais a entidade está inserida
   */
  public getSets() {
    // TODO
    return null
  }

  /**
   * setPetriNet(petriNet)
   * @param petriNet - Rede de petri associada a entidade
   * @returns Lista de filas nas quais a entidade está inserida
   */
  public setPetriNet(petriNet: any) {
    this.petriNet = petriNet
  }
}
